import { Injectable } from '@nestjs/common';
import { MenuItem as PrismaMenuItem } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';

/**
 * Repository MenuItem — gère l'accès aux données via Prisma
 */
@Injectable()
export class MenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un nouvel article dans une catégorie de menu
   */
  create(menuCategoryId: string, dto: CreateMenuItemDto): MenuItem {
    const item: MenuItem = {
      id: this.generateId(),
      menuCategoryId, // ID de la catégorie parente
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      isAvailable: dto.isAvailable ?? true, // true par défaut
      isPopular: dto.isPopular ?? false, // false par défaut
      isVegetarian: dto.isVegetarian ?? false,
      isVegan: dto.isVegan ?? false,
      isGlutenFree: dto.isGlutenFree ?? false,
      isHalal: dto.isHalal ?? false,
      isKosher: dto.isKosher ?? false,
      preparationTime: dto.preparationTime,
      calories: dto.calories,
      allergens: dto.allergens,
      ingredients: dto.ingredients,
      sortOrder: dto.sortOrder,
      isDeleted: false, // non supprimé par défaut
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
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
   * Trouve un article par ID (exclut les soft-deleted)
   */
  async findOne(id: string): Promise<MenuItem | null> {
    const item = await this.prisma.menuItem.findFirst({
      where: { id, isDeleted: false },
    });

    if (!item) return null;
    return this.mapToEntity(item);
  }

  /**
   * Modifie un article existant
   */
  async update(
    id: string,
    dto: UpdateMenuItemDto,
  ): Promise<MenuItem | null> {
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
        ...(dto.isPopular !== undefined && { isPopular: dto.isPopular }),
        ...(dto.isVegetarian !== undefined && { isVegetarian: dto.isVegetarian }),
        ...(dto.isVegan !== undefined && { isVegan: dto.isVegan }),
        ...(dto.isGlutenFree !== undefined && { isGlutenFree: dto.isGlutenFree }),
        ...(dto.isHalal !== undefined && { isHalal: dto.isHalal }),
        ...(dto.isKosher !== undefined && { isKosher: dto.isKosher }),
        ...(dto.preparationTime !== undefined && { preparationTime: dto.preparationTime }),
        ...(dto.calories !== undefined && { calories: dto.calories }),
        ...(dto.allergens !== undefined && { allergens: dto.allergens }),
        ...(dto.ingredients !== undefined && { ingredients: dto.ingredients }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });

    return this.mapToEntity(item);
  }

  /**
   * Soft-delete : marque l'article comme supprimé
   */
  async softDelete(id: string): Promise<MenuItem | null> {
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
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
