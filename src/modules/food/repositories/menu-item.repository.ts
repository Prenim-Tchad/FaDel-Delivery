import { Injectable } from '@nestjs/common';
import { MenuItem as PrismaMenuItem } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';

/**
 * Repository MenuItem — gère l'accès aux données via Prisma
 */
@Injectable()
export class MenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouvel article dans une catégorie de menu
   */
  async create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const item = await this.prisma.menuItem.create({
      data: {
        menuCategoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isAvailable: dto.isAvailable ?? true,
        isPopular: dto.isPopular ?? false,
        isVegetarian: dto.isVegetarian ?? false,
        isVegan: dto.isVegan ?? false,
        isGlutenFree: dto.isGlutenFree ?? false,
        isHalal: dto.isHalal ?? false,
        isKosher: dto.isKosher ?? false,
        preparationTime: dto.preparationTime,
        calories: dto.calories,
        allergens: dto.allergens ?? [],
        ingredients: dto.ingredients ?? [],
        sortOrder: dto.sortOrder ?? 0,
        isDeleted: false,
        deletedAt: null,
      },
    });

    return this.mapToEntity(item);
  }

  /**
   * Vérifie si une catégorie de menu existe en BDD
   */
  async menuCategoryExists(menuCategoryId: string): Promise<boolean> {
    const category = await this.prisma.menuCategory.findFirst({
      where: { id: menuCategoryId, isDeleted: false },
    });
    return !!category;
  }

  /**
   * Convertit un objet Prisma en entité MenuItem
   * Utilise le type Prisma généré pour éviter les erreurs any
   */
  private mapToEntity(data: PrismaMenuItem): MenuItem {
    return {
      id: data.id,
      menuCategoryId: data.menuCategoryId,
      name: data.name,
      description: data.description ?? undefined,
      price: data.price,
      imageUrl: data.imageUrl ?? undefined,
      isAvailable: data.isAvailable,
      isPopular: data.isPopular,
      isVegetarian: data.isVegetarian,
      isVegan: data.isVegan,
      isGlutenFree: data.isGlutenFree,
      isHalal: data.isHalal,
      isKosher: data.isKosher,
      preparationTime: data.preparationTime ?? undefined,
      calories: data.calories ?? undefined,
      allergens: data.allergens ?? [],
      ingredients: data.ingredients ?? [],
      sortOrder: data.sortOrder ?? undefined,
      isDeleted: data.isDeleted,
      deletedAt: data.deletedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}