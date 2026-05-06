import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import type { BatchPayloadResult } from '../repositories/restaurant.repository';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';
import type { CreateDeliveryZonesDto } from '../dtos/create-delivery-zone.dto';
import { RestaurantStatus } from '../../../shared/types';

type RestaurantEntity = {
  id: string;
  rating?: number | null;
  status?: RestaurantStatus | null;
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
      status:
        (restaurant.status as RestaurantStatus) ??
        (restaurant.isActive ? RestaurantStatus.ACTIVE : RestaurantStatus.INACTIVE),
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

  async updateStatus(id: string, status: RestaurantStatus): Promise<unknown> {
    const restaurant = (await this.restaurantRepository.findById(
      id,
    )) as RestaurantEntity | null;

    if (!restaurant) {
      throw new NotFoundException(`Le restaurant avec l'ID ${id} n'existe pas.`);
    }

    const currentStatus =
      (restaurant.status as RestaurantStatus) ??
      (restaurant.isActive ? RestaurantStatus.ACTIVE : RestaurantStatus.INACTIVE);

    if (!this.isStatusTransitionAllowed(currentStatus, status)) {
      throw new BadRequestException(
        `Transition de statut invalide : ${currentStatus} -> ${status}`,
      );
    }

    return this.restaurantRepository.updateStatus(id, status);
  }

  private isStatusTransitionAllowed(
    currentStatus: RestaurantStatus,
    nextStatus: RestaurantStatus,
  ): boolean {
    const transitions: Record<RestaurantStatus, RestaurantStatus[]> = {
      [RestaurantStatus.PENDING]: [RestaurantStatus.ACTIVE, RestaurantStatus.CLOSED],
      [RestaurantStatus.ACTIVE]: [RestaurantStatus.SUSPENDED, RestaurantStatus.CLOSED],
      [RestaurantStatus.SUSPENDED]: [RestaurantStatus.ACTIVE, RestaurantStatus.CLOSED],
      [RestaurantStatus.CLOSED]: [],
      [RestaurantStatus.INACTIVE]: [RestaurantStatus.ACTIVE, RestaurantStatus.CLOSED],
      [RestaurantStatus.MAINTENANCE]: [RestaurantStatus.ACTIVE, RestaurantStatus.SUSPENDED, RestaurantStatus.CLOSED],
      [RestaurantStatus.TEMPORARILY_CLOSED]: [RestaurantStatus.ACTIVE, RestaurantStatus.CLOSED],
    };

    return transitions[currentStatus]?.includes(nextStatus) ?? false;
  }

  async remove(id: string): Promise<unknown> {
    // On vérifie d'abord l'existence
    await this.findOne(id);
    return this.restaurantRepository.delete(id);
  }

  async getMenu(id: string) {
    const menu = await this.restaurantRepository.getRestaurantMenu(id);

    // Si le restaurant n'existe pas, on renvoie une erreur 404
    if (!menu) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    return menu;
  }
}
