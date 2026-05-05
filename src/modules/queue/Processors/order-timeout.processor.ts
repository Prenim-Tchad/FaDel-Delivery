import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { QueueService } from '../queue.service';
import { QUEUE_NAMES, JOB_NAMES } from '../queue.constants';

interface OrderTimeoutJobData {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerPhone: string;
}

@Processor(QUEUE_NAMES.ORDER_TIMEOUT)
export class OrderTimeoutProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderTimeoutProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {
    super();
  }

  async process(job: Job<OrderTimeoutJobData>): Promise<void> {
    if (job.name !== JOB_NAMES.ORDER_TIMEOUT_CHECK) return;

    const { orderId, orderNumber, customerId, customerPhone } = job.data;
    this.logger.warn(`⏱ Vérification timeout: #${orderNumber}`);

    // 1. Vérifier le statut actuel en DB
    const order = await this.prisma.foodOrder.findUnique({
      where: { id: orderId },
      select: { status: true, paymentStatus: true },
    });

    if (!order) {
      this.logger.warn(`Commande ${orderId} introuvable`);
      return;
    }

    // 2. Si toujours PENDING → annuler automatiquement
    if (order.status !== OrderStatus.PENDING) {
      this.logger.log(
        `Commande #${orderNumber} déjà traitée (${order.status}) — timeout ignoré`,
      );
      return;
    }

    // 3. Annuler la commande
    await this.prisma.foodOrder.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    this.logger.warn(`❌ Commande #${orderNumber} annulée par timeout (5 min)`);

    // 4. Notifier le client
    await this.queueService.notifyOrderStatus({
      orderId,
      orderNumber,
      customerId,
      customerPhone,
      status: OrderStatus.CANCELLED,
    });

    // 5. Si paiement effectué → déclencher remboursement
    if (order.paymentStatus === 'PAID') {
      await this.prisma.foodOrder.update({
        where: { id: orderId },
        data: { paymentStatus: 'REFUNDED' },
      });
      this.logger.log(`Remboursement déclenché pour commande #${orderNumber}`);
    }
  }
}
