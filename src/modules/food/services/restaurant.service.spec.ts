import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: RestaurantRepository;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        { provide: RestaurantRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<RestaurantRepository>(RestaurantRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if restaurant does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should return a restaurant if it exists', async () => {
      const restaurant = { id: '1', name: 'La Palmeraie' };
      mockRepository.findById.mockResolvedValue(restaurant);
      const result = await service.findOne('1');
      expect(result).toEqual(restaurant);
    });
  });
});
