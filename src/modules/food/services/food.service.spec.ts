import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { FoodRepository } from '../repositories/food.repository';
import { BadRequestException } from '@nestjs/common';
import { FoodStatus } from '../enums/food.enums';

describe('FoodService', () => {
  let service: FoodService;
  let repo: FoodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: FoodRepository,
          // On simule (mock) le repository pour ne pas toucher à la vraie base
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
      const dto = { name: 'Burger', price: 0, preparationTime: 15, ingredients: [], category: 'FastFood', partnerId: '1' };
      
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
    });

    it('devrait créer un plat avec succès si les données sont valides', async () => {
      const dto = { name: 'Pizza', price: 5000, preparationTime: 20, ingredients: ['Tomate'], category: 'Italien', partnerId: '1' };
      const expectedResult = { id: 'food_1', ...dto, status: FoodStatus.AVAILABLE };

      // On simule la réponse du repo
      (repo.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.create(dto as any);
      expect(result).toEqual(expectedResult);
      expect(repo.create).toHaveBeenCalledWith(dto);
    });
  });
});