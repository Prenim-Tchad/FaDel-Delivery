import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { DriverAssignmentProcessor } from './Processors/driver-assignment.processor';
import { NotificationDispatchProcessor } from './Processors/notification-dispatch.processor';
import { OrderProcessingProcessor } from './Processors/order-processing.processor';
import { OrderTimeoutProcessor } from './Processors/order-timeout.processor';
import { QUEUE_CONFIG, QUEUE_NAMES } from './queue.constants';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') ?? 'localhost',
          port: configService.get<number>('REDIS_PORT') ?? 6379,
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    // ── Queue: order-processing ──────────────────────────────────────────
    BullModule.registerQueue({
      name: QUEUE_NAMES.ORDER_PROCESSING,
      defaultJobOptions: {
        attempts: QUEUE_CONFIG.DEFAULT_JOB_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: QUEUE_CONFIG.DEFAULT_BACKOFF_DELAY,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }),

    // ── Queue: order-timeout (5 min delay) ──────────────────────────────
    BullModule.registerQueue({
      name: QUEUE_NAMES.ORDER_TIMEOUT,
      defaultJobOptions: {
        attempts: 1,
        delay: QUEUE_CONFIG.ORDER_TIMEOUT_MS,
        removeOnComplete: 50,
        removeOnFail: 20,
      },
    }),

    // ── Queue: driver-assignment-retry (3× 60s) ──────────────────────────
    BullModule.registerQueue({
      name: QUEUE_NAMES.DRIVER_ASSIGNMENT_RETRY,
      defaultJobOptions: {
        attempts: QUEUE_CONFIG.DRIVER_RETRY_ATTEMPTS,
        backoff: {
          type: 'fixed',
          delay: QUEUE_CONFIG.DRIVER_RETRY_DELAY_MS,
        },
        removeOnComplete: 50,
        removeOnFail: 20,
      },
    }),

    // ── Queue: notification-dispatch ─────────────────────────────────────
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATION_DISPATCH,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 200,
        removeOnFail: 50,
      },
    }),
  ],
  providers: [
    PrismaService,
    QueueService,
    OrderProcessingProcessor,
    OrderTimeoutProcessor,
    DriverAssignmentProcessor,
    NotificationDispatchProcessor,
  ],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
