import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES } from '../queue.constants';
import { OrderJobData } from '../queue.service';

@Processor(QUEUE_NAMES.ORDER_PROCESSING)
export class OrderProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessingProcessor.name);

  async process(job: Job<OrderJobData>): Promise<void> {
    this.logger.log(`Traitement job: ${job.name} | orderId=${job.data.orderId}`);

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
    this.logger.log(`Nouvelle commande: orderId=${data.orderId}`);
    // TODO: valider stock, notifier partenaire
  }

  private async handleConfirmOrder(data: OrderJobData): Promise<void> {
    this.logger.log(`Commande confirmée: orderId=${data.orderId}`);
    // TODO: mettre à jour statut, déclencher livraison
  }

  private async handleCancelOrder(data: OrderJobData): Promise<void> {
    this.logger.log(`Commande annulée: orderId=${data.orderId}`);
    // TODO: rembourser, notifier client
  }
}
