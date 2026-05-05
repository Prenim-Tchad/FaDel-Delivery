import { PrismaService } from '../../prisma.service';

@Module({
  imports: [ /* ... queues ... */ ],
  providers: [
    PrismaService, // ✅ ajout
    QueueService,
    OrderProcessingProcessor,
    OrderTimeoutProcessor,
    DriverAssignmentProcessor,
    NotificationDispatchProcessor,
  ],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
