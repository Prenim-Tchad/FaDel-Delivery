import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async create(dto: CreateRestaurantDto) {
    return this.restaurantRepository.create(dto);
  }

  async findAll() {
    return this.restaurantRepository.findAll();
  }

  async findOne(id: string) {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new NotFoundException(`Le restaurant avec l'ID ${id} n'existe pas.`);
    }
    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    await this.findOne(id);
    return this.restaurantRepository.update(id, dto);
  }

  async updateOpeningHours(id: string, dto: CreateOpeningHoursDto) {
    await this.findOne(id);
    return this.restaurantRepository.updateOpeningHours(id, dto.hours);
  }

  async updateDeliveryZones(id: string, dto: CreateDeliveryZonesDto) {
    await this.findOne(id);
    return this.restaurantRepository.updateDeliveryZones(id, dto.zones);
  }

  async remove(id: string) {
    // On vérifie d'abord l'existence
    await this.findOne(id);
    return this.restaurantRepository.delete(id);
  }
}
