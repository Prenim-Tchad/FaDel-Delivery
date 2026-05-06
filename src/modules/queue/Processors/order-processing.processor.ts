import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma.service';
import { JOB_NAMES, QUEUE_NAMES } from '../queue.constants';
import { OrderJobData, QueueService } from '../queue.service';

@Processor(QUEUE_NAMES.ORDER_PROCESSING)
export class OrderProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {
    super();
  }

  async process(job: Job<OrderJobData>): Promise<void> {
    this.logger.log(`Job: ${job.name} | orderId=${job.data.orderId}`);

    switch (job.name) {
      case JOB_NAMES.PROCESS_NEW_ORDER:
        await this.handleNewOrder(job.data);
        break;
      case JOB_NAMES.CONFIRM_ORDER:
        await this.handleConfirmOrder(job.data);
        break;
      case JOB_NAMES.CANCEL_ORDER:
        await this.handleCancelOrder(job.data);
        break;
      default:
        this.logger.warn(`Job inconnu: ${job.name}`);
    }
  }

  private async handleNewOrder(data: OrderJobData): Promise<void> {
    // 1. Vérifier que la commande existe encore en PENDING
    const order = await this.prisma.foodOrder.findUnique({
      where: { id: data.orderId },
    });

    if (!order || order.status !== OrderStatus.PENDING) {
      this.logger.warn(`Commande ${data.orderId} introuvable ou déjà traitée`);
      return;
    }

    // 2. Scheduler le timeout de 5 min
    await this.queueService.scheduleOrderTimeout(
      data.orderId,
      data.orderNumber,
      data.customerId,
      data.customerPhone,
    );

    // 3. Notifier le client
    await this.queueService.notifyOrderStatus({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      customerPhone: data.customerPhone,
      status: OrderStatus.PENDING,
    });

    this.logger.log(`Commande #${data.orderNumber} en attente de confirmation`);
  }

  private async handleConfirmOrder(data: OrderJobData): Promise<void> {
    // 1. Mettre à jour le statut en DB
    await this.prisma.foodOrder.update({
      where: { id: data.orderId },
      data: {
        status: OrderStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
    });

    // 2. Annuler le timeout (restaurant a confirmé)
    await this.queueService.cancelOrderTimeout(data.orderId);

    // 3. Déclencher l'assignation d'un chauffeur
    await this.queueService.addDriverAssignmentJob({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      restaurantId: data.restaurantId,
      deliveryLatitude: data.deliveryLatitude,
      deliveryLongitude: data.deliveryLongitude,
      deliveryAddress: data.deliveryAddress,
      customerPhone: data.customerPhone,
      totalAmount: data.totalAmount,
    });

    // 4. Notifier le client
    await this.queueService.notifyOrderStatus({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      customerPhone: data.customerPhone,
      status: OrderStatus.CONFIRMED,
    });

    this.logger.log(`Commande #${data.orderNumber} confirmée`);
  }

  private async handleCancelOrder(data: OrderJobData): Promise<void> {
    // 1. Mettre à jour le statut
    await this.prisma.foodOrder.update({
      where: { id: data.orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    // 2. Annuler le timeout
    await this.queueService.cancelOrderTimeout(data.orderId);

    // 3. Notifier le client
    await this.queueService.notifyOrderStatus({
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      customerPhone: data.customerPhone,
      status: OrderStatus.CANCELLED,
    });

    this.logger.log(`Commande #${data.orderNumber} annulée`);
  }
}
