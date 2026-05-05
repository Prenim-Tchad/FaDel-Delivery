import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES, QUEUE_CONFIG } from '../queue.constants';
import { DriverAssignmentJobData } from '../queue.service';

@Processor(QUEUE_NAMES.DRIVER_ASSIGNMENT_RETRY)
export class DriverAssignmentProcessor extends WorkerHost {
  private readonly logger = new Logger(DriverAssignmentProcessor.name);

  async process(job: Job<DriverAssignmentJobData>): Promise<void> {
    if (job.name !== JOB_NAMES.ASSIGN_DRIVER) return;

    const { orderId, orderNumber, deliveryLatitude, deliveryLongitude } = job.data;
    const attempt = job.attemptsMade + 1;

    this.logger.log(
      `Tentative #${attempt}/${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} | orderId=${orderId} | orderNumber=${orderNumber}`,
    );

    const assigned = await this.tryAssignDriver(job.data);

    if (!assigned) {
      if (job.attemptsMade >= QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS - 1) {
        this.logger.error(
          `❌ Aucun chauffeur trouvé après ${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} tentatives | orderId=${orderId}`,
        );
        // TODO: notifier admin, annuler commande ou passer en manuel
        throw new UnrecoverableError('Aucun chauffeur disponible');
      }
      this.logger.warn(`Chauffeur non disponible — nouvelle tentative dans 60s | orderId=${orderId}`);
      throw new Error('Chauffeur non disponible');
    }

    this.logger.log(`✅ Chauffeur assigné | orderId=${orderId}`);
  }

  private async tryAssignDriver(data: DriverAssignmentJobData): Promise<boolean> {
    // TODO: chercher Profile avec isRider=true et disponible
    // dans la zone de livraison (data.deliveryLatitude, data.deliveryLongitude)
    // Mettre à jour FoodOrder.riderId
    this.logger.debug(`Recherche chauffeur pour zone: ${data.deliveryLatitude}, ${data.deliveryLongitude}`);
    return false;
  }
}
