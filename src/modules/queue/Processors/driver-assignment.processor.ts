import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, UnrecoverableError } from 'bullmq';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { QueueService, DriverAssignmentJobData } from '../queue.service';
import { QUEUE_NAMES, JOB_NAMES, QUEUE_CONFIG } from '../queue.constants';

@Processor(QUEUE_NAMES.DRIVER_ASSIGNMENT_RETRY)
export class DriverAssignmentProcessor extends WorkerHost {
  private readonly logger = new Logger(DriverAssignmentProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {
    super();
  }

  async process(job: Job<DriverAssignmentJobData>): Promise<void> {
    if (job.name !== JOB_NAMES.ASSIGN_DRIVER) return;

    const { orderId, orderNumber } = job.data;
    const attempt = job.attemptsMade + 1;

    this.logger.log(`Tentative #${attempt}/${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} | #${orderNumber}`);

    const rider = await this.findAvailableRider(job.data);

    if (!rider) {
      if (job.attemptsMade >= QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS - 1) {
        this.logger.error(`❌ Aucun chauffeur après ${QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS} tentatives | #${orderNumber}`);
        // Notifier admin
        await this.queueService.sendNotification({
          type: 'push',
          recipientId: 'admin',
          title: 'Aucun chauffeur disponible',
          body: `Commande #${orderNumber} sans chauffeur après 3 tentatives`,
          orderId,
          orderNumber,
        });
        throw new UnrecoverableError('Aucun chauffeur disponible');
      }

      this.logger.warn(`Chauffeur non disponible — retry dans 60s | #${orderNumber}`);
      throw new Error('Chauffeur non disponible');
    }

    // Assigner le chauffeur à la commande
    await this.prisma.foodOrder.update({
      where: { id: orderId },
      data: {
        riderId: rider.id,
        status: OrderStatus.OUT_FOR_DELIVERY,
      },
    });

    this.logger.log(`✅ Chauffeur ${rider.id} assigné | #${orderNumber}`);
  }

  private async findAvailableRider(
    data: DriverAssignmentJobData,
  ): Promise<{ id: string } | null> {
    // Chercher un rider disponible (isRider=true, isActive=true)
    // sans commande OUT_FOR_DELIVERY en cours
    const rider = await this.prisma.profile.findFirst({
      where: {
        isRider: true,
        isActive: true,
        riderOrders: {
          none: {
            status: OrderStatus.OUT_FOR_DELIVERY,
          },
        },
      },
      select: { id: true },
    });

    return rider;
  }
}