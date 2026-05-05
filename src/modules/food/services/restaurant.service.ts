import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import type { BatchPayloadResult } from '../repositories/restaurant.repository';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';
import type { CreateDeliveryZonesDto } from '../dtos/create-delivery-zone.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async create(dto: CreateRestaurantDto): Promise<unknown> {
    return this.restaurantRepository.create(dto);
  }

  async findAll(): Promise<unknown[]> {
    return this.restaurantRepository.findAll();
  }

  async findOne(id: string): Promise<unknown> {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new NotFoundException(
        `Le restaurant avec l'ID ${id} n'existe pas.`,
      );
    }
    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<unknown> {
    await this.findOne(id);
    return this.restaurantRepository.update(id, dto);
  }

  async updateOpeningHours(
    id: string,
    dto: CreateOpeningHoursDto,
  ): Promise<BatchPayloadResult> {
    await this.findOne(id);
    return this.restaurantRepository.updateOpeningHours(id, dto.hours);
  }

  async updateDeliveryZones(
    id: string,
    dto: CreateDeliveryZonesDto,
  ): Promise<BatchPayloadResult> {
    await this.findOne(id);
    return this.restaurantRepository.updateDeliveryZones(id, dto.zones);
  }

  async remove(id: string): Promise<unknown> {
    // On vérifie d'abord l'existence
    await this.findOne(id);
    return this.restaurantRepository.delete(id);
  }
}
