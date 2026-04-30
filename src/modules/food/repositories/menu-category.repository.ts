
import { Injectable } from '@nestjs/common';
import { Prisma, MenuCategory as PrismaMenuCategory } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';

/**
 * Repository MenuCategory — gère l'accès aux données via Prisma
 */
@Injectable()
export class MenuCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée une nouvelle catégorie de menu pour un restaurant
   */
  async create(
  restaurantId: string,
  dto: CreateMenuCategoryDto,
): Promise<MenuCategory> {
  const name = dto.name as unknown as Prisma.InputJsonValue;
  const description = dto.description
    ? (dto.description as unknown as Prisma.InputJsonValue)
    : Prisma.JsonNull; // 🆕 Prisma.JsonNull au lieu de null

  const category = await this.prisma.menuCategory.create({
    data: {
      restaurantId,
      name,
      description,
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
      where: { id, isDeleted: false },
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
  const name = dto.name
    ? (dto.name as unknown as Prisma.InputJsonValue)
    : undefined;
  const description =
    dto.description !== undefined
      ? dto.description
        ? (dto.description as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull // 🆕 Prisma.JsonNull au lieu de null
      : undefined;

  const category = await this.prisma.menuCategory.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
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
   * Utilise le type Prisma généré pour éviter les erreurs any
   */
  private mapToEntity(data: PrismaMenuCategory): MenuCategory {
  return {
    id: data.id,
    restaurantId: data.restaurantId,
    // Double cast : Json Prisma → unknown → MultiLangField
    name: data.name as unknown as MenuCategory['name'],
    description: data.description
      ? (data.description as unknown as MenuCategory['description'])
      : undefined,
    sort_order: data.sortOrder,
    isDeleted: data.isDeleted,
    deletedAt: data.deletedAt ?? undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
}