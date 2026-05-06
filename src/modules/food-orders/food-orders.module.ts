import { Module } from '@nestjs/common';
import { FoodOrdersService } from './food-orders.service';
import { FoodOrdersController } from './food-orders.controller';

@Module({
  controllers: [FoodOrdersController],
  providers: [FoodOrdersService],
})
export class FoodOrdersModule {}
