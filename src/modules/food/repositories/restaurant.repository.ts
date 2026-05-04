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
    return (await this.prisma.restaurant.create({
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
    })) as unknown;
  }

  async findAll(): Promise<unknown[]> {
    return (await this.prisma.restaurant.findMany()) as unknown[];
  }

  async findById(id: string): Promise<object | null> {
    return (await this.prisma.restaurant.findUnique({
      where: { id },
    })) as object | null;
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

  async update(id: string, data: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
  async update(id: string, data: UpdateRestaurantDto): Promise<unknown> {
    return (await this.prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
      },
    })) as unknown;
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
  async delete(id: string): Promise<unknown> {
    return (await this.prisma.restaurant.delete({
      where: { id },
    })) as unknown;
  }
}
