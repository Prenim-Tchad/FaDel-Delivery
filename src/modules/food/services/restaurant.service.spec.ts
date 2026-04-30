import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { NotFoundException } from '@nestjs/common';

describe('RestaurantService - Tâche 3 (Opening Hours)', () => {
  let service: RestaurantService;

  const mockRepository = {
    findById: jest.fn(),
    updateOpeningHours: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        { provide: RestaurantRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should update opening hours with valid data', async () => {
    const restaurantId = 'cuid-123';
    const dto = {
      hours: [
        { dayOfWeek: 1, openTime: '08:00', closeTime: '22:00', isOpen: true },
      ],
    };

    mockRepository.findById.mockResolvedValue({ id: restaurantId });
    mockRepository.updateOpeningHours.mockResolvedValue({ count: 1 });

    const result = await service.updateOpeningHours(restaurantId, dto);

    expect(mockRepository.updateOpeningHours).toHaveBeenCalledWith(restaurantId, dto.hours);
    expect(result).toBeDefined();
  });

it('should throw NotFoundException if restaurant does not exist when setting hours', async () => {
  mockRepository.findById.mockResolvedValueOnce(null);

  await expect(
    service.updateOpeningHours('cuid-123', {
      hours: [
        { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '22:00' },
        ],
    }),
  ).rejects.toThrow(NotFoundException);

  expect(mockRepository.updateOpeningHours).not.toHaveBeenCalled();
});
});
