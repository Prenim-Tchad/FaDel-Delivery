import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderValidationService } from './services/order-validation.service';
import { PrismaService } from '../../prisma.service';
import { QueueModule } from '../queue/queue.module';
import { FoodModule } from '../food';
import { AuthModule } from '../auth';

@Module({
  imports: [QueueModule, AuthModule, FoodModule], // ✅ Assure-toi d'importer les modules nécessaires
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderValidationService],
  exports: [OrderService],
})
export class OrderModule {}
