import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
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

  async process(job: Job<OrderTimeoutJobData>): Promise<void> {
    if (job.name !== JOB_NAMES.ORDER_TIMEOUT_CHECK) return;

    const { orderId, orderNumber, customerId, customerPhone } = job.data;
    this.logger.warn(`⏱ Timeout commande #${orderNumber} | orderId=${orderId}`);

    // TODO:
    // 1. Vérifier si la commande est toujours PENDING dans Prisma
    // 2. Si oui → statut CANCELLED
    // 3. Notifier client via SMS (customerPhone) et push (customerId)
    // 4. Si paiement effectué → déclencher remboursement
  }
}