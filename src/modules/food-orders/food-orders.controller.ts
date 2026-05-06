import { Controller } from '@nestjs/common';
import { FoodOrdersService } from './food-orders.service';

@Controller('food-orders')
export class FoodOrdersController {
  constructor(private readonly foodOrdersService: FoodOrdersService) {}
}
