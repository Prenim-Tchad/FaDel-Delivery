import { Test, TestingModule } from '@nestjs/testing';
import { FoodOrdersController } from './food-orders.controller';
import { FoodOrdersService } from './food-orders.service';

describe('FoodOrdersController', () => {
  let controller: FoodOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodOrdersController],
      providers: [FoodOrdersService],
    }).compile();

    controller = module.get<FoodOrdersController>(FoodOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
