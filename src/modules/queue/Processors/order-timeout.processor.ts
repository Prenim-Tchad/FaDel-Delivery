import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES } from '../queue.constants';

interface OrderTimeoutJobData {
  orderId: string;
  customerId: string;
}

@Processor(QUEUE_NAMES.ORDER_TIMEOUT)
export class OrderTimeoutProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderTimeoutProcessor.name);

  async process(job: Job<OrderTimeoutJobData>): Promise<void> {
    if (job.name !== JOB_NAMES.ORDER_TIMEOUT_CHECK) return;

    this.logger.warn(`⏱ Timeout commande: orderId=${job.data.orderId}`);
    // TODO: annuler commande si toujours en attente, notifier client
  }
}