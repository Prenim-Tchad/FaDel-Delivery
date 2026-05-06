import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantStatus } from '../../../shared/types';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { RestaurantService } from './restaurant.service';

describe('RestaurantService - Tâche 3 (Opening Hours)', () => {
  let service: RestaurantService;

  const mockRepository = {
    findById: jest.fn(),
    findProfileById: jest.fn(),
    findNearby: jest.fn(),
    updateOpeningHours: jest.fn(),
    updateDeliveryZones: jest.fn(),
    updateStatus: jest.fn(),
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

    mockRepository.findProfileById.mockResolvedValue({ id: restaurantId });
    mockRepository.updateOpeningHours.mockResolvedValue({ count: 1 });

    const result = await service.updateOpeningHours(restaurantId, dto);

    expect(mockRepository.updateOpeningHours).toHaveBeenCalledWith(
      restaurantId,
      dto.hours,
    );
    expect(result).toBeDefined();
  });

  it('should update delivery zones with radius', async () => {
    const restaurantId = 'cuid-123';
    const dto = {
      zones: [
        { name: 'Zone Proche', radius: 5, deliveryFee: 500 },
        { name: 'Zone Large', radius: 15, deliveryFee: 1500 },
      ],
    };

    mockRepository.findProfileById.mockResolvedValue({ id: restaurantId });
    mockRepository.updateDeliveryZones.mockResolvedValue({ count: 2 });

    const result = await service.updateDeliveryZones(restaurantId, dto);

    expect(mockRepository.updateDeliveryZones).toHaveBeenCalledWith(
      restaurantId,
      dto.zones,
    );
    expect(result.count).toBe(2);
  });

  it('should return nearby restaurants sorted by distance', async () => {
    const latitude = 12.34;
    const longitude = 56.78;
    const radiusKm = 10;

    const nearbyRestaurants = [
      { id: 'r2', distance: 1.2 },
      { id: 'r1', distance: 0.8 },
    ];

    mockRepository.findNearby.mockResolvedValue(nearbyRestaurants);

    const result = await service.findNearby(latitude, longitude, radiusKm);

    expect(mockRepository.findNearby).toHaveBeenCalledWith(
      latitude,
      longitude,
      radiusKm,
    );
    expect(result).toEqual(nearbyRestaurants);
  });

  it('should update restaurant status when transition is valid', async () => {
    const restaurantId = 'cuid-123';
    mockRepository.findById.mockResolvedValueOnce({
      id: restaurantId,
      status: RestaurantStatus.PENDING,
    });
    mockRepository.updateStatus.mockResolvedValue({
      id: restaurantId,
      status: RestaurantStatus.ACTIVE,
    });

    const result = await service.updateStatus(
      restaurantId,
      RestaurantStatus.ACTIVE,
    );

    expect(mockRepository.updateStatus).toHaveBeenCalledWith(
      restaurantId,
      RestaurantStatus.ACTIVE,
    );
    expect(result).toEqual({
      id: restaurantId,
      status: RestaurantStatus.ACTIVE,
    });
  });

  it('should reject invalid restaurant status transition', async () => {
    const restaurantId = 'cuid-123';
    mockRepository.findById.mockResolvedValueOnce({
      id: restaurantId,
      status: RestaurantStatus.CLOSED,
    });

    await expect(
      service.updateStatus(restaurantId, RestaurantStatus.ACTIVE),
    ).rejects.toThrow(BadRequestException);
    expect(mockRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if restaurant does not exist when setting hours', async () => {
    mockRepository.findProfileById.mockResolvedValueOnce(null);

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
