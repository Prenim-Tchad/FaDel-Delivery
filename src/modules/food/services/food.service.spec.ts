import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { FoodRepository } from '../repositories/food.repository';
import { BadRequestException } from '@nestjs/common';
import { FoodStatus } from '../enums/food.enums';
import { CreateFoodDto } from '../dto/create-food.dto';

describe('FoodService', () => {
  let service: FoodService;
  let repo: FoodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: FoodRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    repo = module.get<FoodRepository>(FoodRepository);
  });

  describe('create', () => {
    it('devrait rejeter un prix négatif ou nul (Règle Métier)', async () => {
      const dto: Partial<CreateFoodDto> = {
        name: 'Burger',
        price: 0,
        preparationTime: 15,
        ingredients: [],
        category: 'FastFood',
        partnerId: '1',
      };

      await expect(service.create(dto as CreateFoodDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait créer un plat avec succès si les données sont valides', async () => {
      const dto: Partial<CreateFoodDto> = {
        name: 'Pizza',
        price: 5000,
        preparationTime: 20,
        ingredients: ['Tomate'],
        category: 'Italien',
        partnerId: '1',
      };

      const expectedResult = {
        id: 'food_1',
        ...dto,
        status: FoodStatus.AVAILABLE,
      };

      jest.mocked(repo.create).mockResolvedValue(expectedResult as any); // ✅ jest.mocked

      const result = await service.create(dto as CreateFoodDto);

      expect(result).toEqual(expectedResult);
      expect(jest.mocked(repo.create)).toHaveBeenCalledWith(dto); // ✅ jest.mocked évite unbound-method
    });
  });
});
