import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../prisma.service';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { OpeningHourItemDto } from '../dtos/create-opening-hours.dto';

@Injectable()
export class RestaurantRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRestaurantDto) {
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
    });
  }

  async findAll() {
    return this.prisma.restaurant.findMany();
  }

  async findById(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
      },
    });
  }

  async updateOpeningHours(restaurantId: string, hours: OpeningHourItemDto[]) {
    return this.prisma.$transaction(async (tx) => {
      await tx.openingHours.deleteMany({
        where: { restaurantId },
      });
      return tx.openingHours.createMany({
        data: hours.map((h) => ({
          ...h,
          restaurantId,
        })),
      });
    });
  }
  async delete(id: string) {
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }
}
