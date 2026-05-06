import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderValidationService } from './services/order-validation.service';
import { PrismaService } from '../../prisma.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [OrderController],
  providers: [
    PrismaService,
    OrderService,
    OrderValidationService,
  ],
  exports: [OrderService],
})
export class OrderModule {}
