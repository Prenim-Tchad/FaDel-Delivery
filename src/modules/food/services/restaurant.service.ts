import { Injectable, NotFoundException } from '@nestjs/common';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import type { BatchPayloadResult } from '../repositories/restaurant.repository';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';
import type { CreateDeliveryZonesDto } from '../dtos/create-delivery-zone.dto';

type RestaurantEntity = {
  id: string;
  rating?: number | null;
  openingHours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
  }>;
  deliveryZones?: Array<{
    name?: string;
    radius: number;
    deliveryFee: number;
  }>;
  isActive?: boolean | null;
  [key: string]: unknown;
};

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
    const restaurant = (await this.restaurantRepository.findProfileById(
      id,
    )) as RestaurantEntity | null;
    if (!restaurant) {
      throw new NotFoundException(
        `Le restaurant avec l'ID ${id} n'existe pas.`,
      );
    }

    return {
      ...restaurant,
      averageRating: restaurant.rating ?? 0,
      openingHours: restaurant.openingHours ?? [],
      deliveryZones: restaurant.deliveryZones ?? [],
      status: restaurant.isActive ? 'ACTIVE' : 'INACTIVE',
    } as const;
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

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<unknown[]> {
    return this.restaurantRepository.findNearby(latitude, longitude, radiusKm);
  }

  async remove(id: string): Promise<unknown> {
    // On vérifie d'abord l'existence
    await this.findOne(id);
    return this.restaurantRepository.delete(id);
  }

  /**
   * Met à jour l'URL du logo du restaurant après upload vers Cloudflare R2
   * @method updateLogo
   * @param {string} id - ID du restaurant
   * @param {string} logoUrl - URL publique du logo uploadé vers R2
   * @returns {Promise<unknown>} Restaurant mis à jour
   * @throws {NotFoundException} Si le restaurant n'existe pas
   */
  async updateLogo(id: string, logoUrl: string): Promise<unknown> {
    await this.findOne(id);
    return this.restaurantRepository.update(id, { logoUrl });
  }

  /**
   * Met à jour l'URL de l'image de couverture (bannière) du restaurant après upload vers Cloudflare R2
   * @method updateCoverImage
   * @param {string} id - ID du restaurant
   * @param {string} coverImageUrl - URL publique de la bannière uploadée vers R2
   * @returns {Promise<unknown>} Restaurant mis à jour
   * @throws {NotFoundException} Si le restaurant n'existe pas
   */
  async updateCoverImage(id: string, coverImageUrl: string): Promise<unknown> {
    await this.findOne(id);
    return this.restaurantRepository.update(id, { coverImageUrl });
  }
}
