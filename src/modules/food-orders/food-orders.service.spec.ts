import { Test, TestingModule } from '@nestjs/testing';
import { FoodOrdersService } from './food-orders.service';

describe('FoodOrdersService', () => {
  let service: FoodOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodOrdersService],
    }).compile();

    service = module.get<FoodOrdersService>(FoodOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
