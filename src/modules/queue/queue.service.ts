import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES, QUEUE_CONFIG } from './queue.constants';

export interface OrderJobData {
  orderId: string;
  customerId: string;
  partnerId: string;
  totalAmount: number;
  items: Array<{ foodId: string; quantity: number; price: number }>;
}

export interface DriverAssignmentJobData {
  orderId: string;
  partnerId: string;
  attempt: number;
  location?: { lat: number; lng: number };
}

export interface NotificationJobData {
  type: 'push' | 'sms' | 'email';
  recipientId: string;
  recipientPhone?: string;
  recipientEmail?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
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
    await this.orderProcessingQueue.add(
      JOB_NAMES.PROCESS_NEW_ORDER,
      data,
      { priority: 1 },
    );
    this.logger.log(`Job order-processing ajouté: orderId=${data.orderId}`);
  }

  // ── Order Timeout (5 min) ─────────────────────────────────────────────────
  async scheduleOrderTimeout(orderId: string, customerId: string): Promise<void> {
    await this.orderTimeoutQueue.add(
      JOB_NAMES.ORDER_TIMEOUT_CHECK,
      { orderId, customerId },
      {
        delay: QUEUE_CONFIG.ORDER_TIMEOUT_MS,
        jobId: `timeout-${orderId}`, // ✅ unique par commande
      },
    );
    this.logger.log(`Timeout schedulé pour orderId=${orderId} dans 5 min`);
  }

  async cancelOrderTimeout(orderId: string): Promise<void> {
    const job = await this.orderTimeoutQueue.getJob(`timeout-${orderId}`);
    if (job) {
      await job.remove();
      this.logger.log(`Timeout annulé pour orderId=${orderId}`);
    }
  }

  // ── Driver Assignment Retry (3× 60s) ──────────────────────────────────────
  async addDriverAssignmentJob(data: DriverAssignmentJobData): Promise<void> {
    await this.driverAssignmentQueue.add(
      JOB_NAMES.ASSIGN_DRIVER,
      data,
      {
        attempts: QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS,
        backoff: {
          type: 'fixed',
          delay: QUEUE_CONFIG.DRIVER_RETRY_DELAY_MS,
        },
      },
    );
    this.logger.log(`Job driver-assignment ajouté: orderId=${data.orderId}`);
  }

  // ── Notification Dispatch ─────────────────────────────────────────────────
  async sendNotification(data: NotificationJobData): Promise<void> {
    await this.notificationQueue.add(
      JOB_NAMES.SEND_PUSH_NOTIFICATION,
      data,
    );
    this.logger.log(`Notification ajoutée: type=${data.type} recipient=${data.recipientId}`);
  }

  async sendBulkNotifications(notifications: NotificationJobData[]): Promise<void> {
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