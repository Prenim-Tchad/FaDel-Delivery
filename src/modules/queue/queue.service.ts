import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OrderStatus, OrderType, PaymentMethod } from '@prisma/client';
import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_CONFIG, QUEUE_NAMES } from './queue.constants';

// ── Types alignés sur le schéma Prisma ───────────────────────────────────
export interface OrderJobData {
  orderId: string;
  orderNumber: string;
  customerId: string;
  restaurantId: string;
  riderId?: string;
  status: OrderStatus;
  orderType: OrderType;
  totalAmount: number;
  deliveryFee: number;
  customerPhone: string;
  customerName: string;
  deliveryAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  paymentMethod?: PaymentMethod;
  items: OrderItemJobData[];
}

export interface OrderItemJobData {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface DriverAssignmentJobData {
  orderId: string;
  orderNumber: string;
  restaurantId: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryAddress?: string;
  customerPhone: string;
  totalAmount: number;
}

export interface NotificationJobData {
  type: 'push' | 'sms' | 'email';
  recipientId: string;
  recipientPhone?: string;
  recipientEmail?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  // Contexte métier
  orderId?: string;
  orderNumber?: string;
  orderStatus?: OrderStatus;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.ORDER_PROCESSING)
    private readonly orderProcessingQueue: Queue,

    @InjectQueue(QUEUE_NAMES.ORDER_TIMEOUT)
    private readonly orderTimeoutQueue: Queue,

    @InjectQueue(QUEUE_NAMES.DRIVER_ASSIGNMENT_RETRY)
    private readonly driverAssignmentQueue: Queue,

    @InjectQueue(QUEUE_NAMES.NOTIFICATION_DISPATCH)
    private readonly notificationQueue: Queue,
  ) {}

  // ── Order Processing ──────────────────────────────────────────────────────
  async addOrderProcessingJob(data: OrderJobData): Promise<void> {
    await this.orderProcessingQueue.add(JOB_NAMES.PROCESS_NEW_ORDER, data, {
      priority: 1,
    });
    this.logger.log(
      `Job order-processing ajouté: orderId=${data.orderId} | orderNumber=${data.orderNumber}`,
    );
  }

  async confirmOrder(data: OrderJobData): Promise<void> {
    await this.orderProcessingQueue.add(JOB_NAMES.CONFIRM_ORDER, data);
    this.logger.log(`Confirmation commande: orderId=${data.orderId}`);
  }

  async cancelOrder(data: OrderJobData): Promise<void> {
    await this.orderProcessingQueue.add(JOB_NAMES.CANCEL_ORDER, data);
    this.logger.log(`Annulation commande: orderId=${data.orderId}`);
  }

  // ── Order Timeout 5 min ───────────────────────────────────────────────────
  async scheduleOrderTimeout(
    orderId: string,
    orderNumber: string,
    customerId: string,
    customerPhone: string,
  ): Promise<void> {
    await this.orderTimeoutQueue.add(
      JOB_NAMES.ORDER_TIMEOUT_CHECK,
      { orderId, orderNumber, customerId, customerPhone },
      {
        delay: QUEUE_CONFIG.ORDER_TIMEOUT_MS,
        jobId: `timeout-${orderId}`, // ✅ un seul timeout par commande
      },
    );
    this.logger.log(
      `Timeout schedulé: orderId=${orderId} | orderNumber=${orderNumber} dans 5 min`,
    );
  }

  async cancelOrderTimeout(orderId: string): Promise<void> {
    const job = await this.orderTimeoutQueue.getJob(`timeout-${orderId}`);
    if (job) {
      await job.remove();
      this.logger.log(`Timeout annulé: orderId=${orderId}`);
    }
  }

  // ── Driver Assignment Retry 3× 60s ───────────────────────────────────────
  async addDriverAssignmentJob(data: DriverAssignmentJobData): Promise<void> {
    await this.driverAssignmentQueue.add(JOB_NAMES.ASSIGN_DRIVER, data, {
      attempts: QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS,
      backoff: {
        type: 'fixed',
        delay: QUEUE_CONFIG.DRIVER_RETRY_DELAY_MS,
      },
      jobId: `driver-${data.orderId}`, // ✅ un seul job par commande
    });
    this.logger.log(`Job driver-assignment ajouté: orderId=${data.orderId}`);
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  async sendNotification(data: NotificationJobData): Promise<void> {
    await this.notificationQueue.add(JOB_NAMES.SEND_PUSH_NOTIFICATION, data);
    this.logger.log(
      `Notification ajoutée: type=${data.type} | recipient=${data.recipientId}`,
    );
  }

  // ✅ Notifications dédiées aux événements commandes
  async notifyOrderStatus(
    order: Pick<
      OrderJobData,
      'orderId' | 'orderNumber' | 'customerId' | 'customerPhone' | 'status'
    >,
  ): Promise<void> {
    const messages: Record<OrderStatus, { title: string; body: string }> = {
      PENDING: {
        title: 'Commande reçue',
        body: `Votre commande #${order.orderNumber} est en attente de confirmation.`,
      },
      CONFIRMED: {
        title: 'Commande confirmée',
        body: `Votre commande #${order.orderNumber} a été confirmée par le restaurant.`,
      },
      PREPARING: {
        title: 'En préparation',
        body: `Votre commande #${order.orderNumber} est en cours de préparation.`,
      },
      READY: {
        title: 'Commande prête',
        body: `Votre commande #${order.orderNumber} est prête pour la livraison.`,
      },
      OUT_FOR_DELIVERY: {
        title: 'En route !',
        body: `Votre commande #${order.orderNumber} est en cours de livraison.`,
      },
      DELIVERED: {
        title: 'Commande livrée',
        body: `Votre commande #${order.orderNumber} a été livrée. Bon appétit !`,
      },
      CANCELLED: {
        title: 'Commande annulée',
        body: `Votre commande #${order.orderNumber} a été annulée.`,
      },
      REFUNDED: {
        title: 'Remboursement',
        body: `Le remboursement de votre commande #${order.orderNumber} est en cours.`,
      },
    };

    const message = messages[order.status];

    await this.sendNotification({
      type: 'push',
      recipientId: order.customerId,
      recipientPhone: order.customerPhone,
      title: message.title,
      body: message.body,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      data: { orderId: order.orderId, orderNumber: order.orderNumber },
    });
  }

  async sendBulkNotifications(
    notifications: NotificationJobData[],
  ): Promise<void> {
    const jobs = notifications.map((data) => ({
      name: JOB_NAMES.SEND_PUSH_NOTIFICATION,
      data,
    }));
    await this.notificationQueue.addBulk(jobs);
    this.logger.log(`${notifications.length} notifications ajoutées en bulk`);
  }

  // ── Health check ──────────────────────────────────────────────────────────
  async getQueuesHealth(): Promise<Record<string, object>> {
    const [
      orderProcessingCounts,
      orderTimeoutCounts,
      driverAssignmentCounts,
      notificationCounts,
    ] = await Promise.all([
      this.orderProcessingQueue.getJobCounts(),
      this.orderTimeoutQueue.getJobCounts(),
      this.driverAssignmentQueue.getJobCounts(),
      this.notificationQueue.getJobCounts(),
    ]);

    return {
      [QUEUE_NAMES.ORDER_PROCESSING]: orderProcessingCounts,
      [QUEUE_NAMES.ORDER_TIMEOUT]: orderTimeoutCounts,
      [QUEUE_NAMES.DRIVER_ASSIGNMENT_RETRY]: driverAssignmentCounts,
      [QUEUE_NAMES.NOTIFICATION_DISPATCH]: notificationCounts,
    };
  }
}
