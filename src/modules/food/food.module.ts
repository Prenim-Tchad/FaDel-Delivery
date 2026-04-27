import { Module } from '@nestjs/common';
import { FoodController } from './controllers/food.controller';
import { FoodService } from './services/food.service';
import { FoodRepository } from './repositories/food.repository';

@Module({
  controllers: [FoodController],
  providers: [FoodService, FoodRepository],
  exports: [FoodService, FoodRepository],
})
export class FoodModule {}