import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../prisma.service';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { OpeningHourItemDto } from '../dtos/create-opening-hours.dto';
import type { DeliveryZoneItemDto } from '../dtos/create-delivery-zone.dto';

@Injectable()
export class RestaurantRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantDto): Promise<unknown> {
    return this.prisma.restaurant.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        logoUrl: data.logoUrl,
        coverImageUrl: data.coverImageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        rccm: data.rccm,
        slug: data.slug,
        city: "N'Djamena",
        owner: {
          connect: { id: data.ownerId },
        },
        cuisineCategory: {
          connect: { id: data.cuisineCategoryId },
        },
      },
    }) as unknown;
  }

  async findAll(): Promise<unknown[]> {
    return (await this.prisma.restaurant.findMany()) as unknown[];
  }

  async findById(id: string): Promise<unknown | null> {
    return this.prisma.restaurant.findUnique({
      where: { id },
    }) as unknown;
  }

  async update(id: string, data: UpdateRestaurantDto): Promise<unknown> {
    return this.prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
      },
    }) as unknown;
  }

  async updateDeliveryZones(
    restaurantId: string,
    zones: DeliveryZoneItemDto[],
  ): Promise<unknown> {
    return this.prisma.$transaction(async (tx) => {
      await tx.deliveryZone.deleteMany({
        where: { restaurantId },
      });
      return (await tx.deliveryZone.createMany({
        data: zones.map((z) => ({
          ...z,
          restaurantId,
        })),
      })) as unknown;
    }) as unknown;
  }

  async updateOpeningHours(
    restaurantId: string,
    hours: OpeningHourItemDto[],
  ): Promise<unknown> {
    return this.prisma.$transaction(async (tx) => {
      await tx.openingHours.deleteMany({
        where: { restaurantId },
      });
      return (await tx.openingHours.createMany({
        data: hours.map((h) => ({
          ...h,
          restaurantId,
        })),
      })) as unknown;
    }) as unknown;
  }
  async delete(id: string): Promise<unknown> {
    return this.prisma.restaurant.delete({
      where: { id },
    }) as unknown;
  }
}
