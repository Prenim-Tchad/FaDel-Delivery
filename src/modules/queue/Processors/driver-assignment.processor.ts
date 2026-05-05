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

    const { orderId, attempt } = job.data;
    this.logger.log(`Tentative assignation chauffeur #${job.attemptsMade + 1}/${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} | orderId=${orderId}`);

    const assigned = await this.tryAssignDriver(job.data);

    if (!assigned) {
      if (job.attemptsMade >= QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS - 1) {
        this.logger.error(`❌ Aucun chauffeur trouvé après ${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} tentatives | orderId=${orderId}`);
        throw new UnrecoverableError('Aucun chauffeur disponible');
      }
      throw new Error('Chauffeur non disponible — nouvelle tentative dans 60s');
    }

    this.logger.log(`✅ Chauffeur assigné pour orderId=${orderId}`);
  }

  private async tryAssignDriver(_data: DriverAssignmentJobData): Promise<boolean> {
    // TODO: chercher chauffeur disponible dans la zone
    return false;
  }
}