import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../prisma.service';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { OpeningHourItemDto } from '../dtos/create-opening-hours.dto';
import type { DeliveryZoneItemDto } from '../dtos/create-delivery-zone.dto';

export type BatchPayloadResult = {
  count: number;
};
type CreateManyDelegate = {
  deleteMany(args: object): Promise<unknown>;
  createMany(args: object): Promise<BatchPayloadResult>;
};
type RestaurantTransactionClient = {
  deliveryZone: CreateManyDelegate;
  openingHours: CreateManyDelegate;
};
type TransactionRunner = <T>(
  callback: (tx: RestaurantTransactionClient) => Promise<T>,
) => Promise<T>;

@Injectable()
export class RestaurantRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantDto): Promise<unknown> {
    return await this.prisma.restaurant.create({
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
        status: 'pending',
        owner: {
          connect: { id: data.ownerId },
        },
        cuisineCategory: {
          connect: { id: data.cuisineCategoryId },
        },
      },
    });
  }

  async findAll(): Promise<unknown[]> {
    return await this.prisma.restaurant.findMany();
  }

  async findById(id: string): Promise<object | null> {
    return await this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async findProfileById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        openingHours: true,
        deliveryZones: true,
      },
    });
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  private getHaversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const earthRadiusKm = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<unknown[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        openingHours: true,
        deliveryZones: true,
      },
    });

    return restaurants
      .map((restaurant) => {
        const distance = this.getHaversineDistance(
          latitude,
          longitude,
          restaurant.latitude as number,
          restaurant.longitude as number,
        );
        return {
          ...restaurant,
          distance,
        };
      })
      .filter((restaurant) => restaurant.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  async update(id: string, data: UpdateRestaurantDto): Promise<unknown> {
    return await this.prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<unknown> {
    return await this.prisma.restaurant.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async updateDeliveryZones(
    restaurantId: string,
    zones: DeliveryZoneItemDto[],
  ): Promise<BatchPayloadResult> {
    const transaction = this.prisma.$transaction.bind(
      this.prisma,
    ) as unknown as TransactionRunner;
    const transactionResult = await transaction(async (tx) => {
      await tx.deliveryZone.deleteMany({
        where: { restaurantId },
      });
      const createResult = await tx.deliveryZone.createMany({
        data: zones.map((zone, index) => ({
          name: zone.name ?? `Zone ${index + 1}`,
          radius: zone.radius,
          deliveryFee: zone.deliveryFee,
          restaurantId,
        })),
      });
      return createResult;
    });
    return transactionResult;
  }

  async updateOpeningHours(
    restaurantId: string,
    hours: OpeningHourItemDto[],
  ): Promise<BatchPayloadResult> {
    const transaction = this.prisma.$transaction.bind(
      this.prisma,
    ) as unknown as TransactionRunner;
    const transactionResult = await transaction(async (tx) => {
      await tx.openingHours.deleteMany({
        where: { restaurantId },
      });
      const createResult = await tx.openingHours.createMany({
        data: hours.map((h) => ({
          ...h,
          restaurantId,
        })),
      });
      return createResult;
    });
    return transactionResult;
  }

  async updateLogo(id: string, logoUrl: string): Promise<unknown> {
    return await this.prisma.restaurant.update({
      where: { id },
      data: {
        logoUrl,
      },
    });
  }

  async addPhotos(id: string, photoUrls: string[]): Promise<unknown> {
    // First get current photos
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      select: { photos: true },
    });

    if (!restaurant) {
      throw new Error(`Restaurant with id ${id} not found`);
    }

    // Append new photos to existing ones
    const updatedPhotos = [...(restaurant.photos || []), ...photoUrls];

    return await this.prisma.restaurant.update({
      where: { id },
      data: {
        photos: updatedPhotos,
      },
    });
  }

  async delete(id: string): Promise<unknown> {
    return await this.prisma.restaurant.delete({
      where: { id },
    });
  }
}
