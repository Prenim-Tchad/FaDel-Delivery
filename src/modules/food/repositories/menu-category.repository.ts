import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';

/**
 * Repository MenuCategory — gère l'accès aux données via Prisma
 *
 * Remplace le stockage in-memory par PostgreSQL via PrismaService
 */
@Injectable()
export class MenuCategoryRepository {
  constructor(
    // Injection du PrismaService pour accéder à la base de données
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Crée une nouvelle catégorie de menu pour un restaurant
   */
  async create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const category = await this.prisma.menuCategory.create({
      data: {
  restaurantId,
  // Conversion en objet JSON simple pour Prisma
  name: JSON.parse(JSON.stringify(dto.name)),
  description: dto.description
    ? JSON.parse(JSON.stringify(dto.description))
    : null,
  sortOrder: dto.sort_order,
  isDeleted: false,
  deletedAt: null,
},
    });

    return this.mapToEntity(category);
  }

  /**
   * Trouve une catégorie par ID (exclut les soft-deleted)
   */
  async findOne(id: string): Promise<MenuCategory | null> {
    const category = await this.prisma.menuCategory.findFirst({
      where: {
        id,
        isDeleted: false, // exclut les supprimés
      },
    });

    if (!category) return null;
    return this.mapToEntity(category);
  }

  /**
   * Modifie une catégorie existante
   */
  async update(
    id: string,
    dto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory | null> {
    const category = await this.prisma.menuCategory.update({
      where: { id },
      data: {
        ...(dto.name && { name: JSON.parse(JSON.stringify(dto.name)) }),
...(dto.description !== undefined && {
  description: dto.description
    ? JSON.parse(JSON.stringify(dto.description))
    : null,
}),
...(dto.sort_order !== undefined && { sortOrder: dto.sort_order }),
      },
    });

    return this.mapToEntity(category);
  }

  /**
   * Soft-delete : marque la catégorie comme supprimée
   */
  async softDelete(id: string): Promise<MenuCategory | null> {
    const category = await this.prisma.menuCategory.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return this.mapToEntity(category);
  }

  /**
   * Vérifie si un restaurant existe en BDD
   */
  async restaurantExists(restaurantId: string): Promise<boolean> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    return !!restaurant;
  }

  /**
   * Convertit un objet Prisma en entité MenuCategory
   * Nécessaire car Prisma retourne des types différents de nos entités
   */
  private mapToEntity(data: any): MenuCategory {
    return {
      id: data.id,
      restaurantId: data.restaurantId,
      name: data.name,
      description: data.description ?? undefined,
      sort_order: data.sortOrder,
      isDeleted: data.isDeleted,
      deletedAt: data.deletedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}