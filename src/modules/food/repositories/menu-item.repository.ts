import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';

type MenuItemRecord = {
  id: string;
  menuCategoryId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isKosher: boolean;
  preparationTime: number | null;
  calories: number | null;
  allergens: string[];
  ingredients: string[];
  sortOrder: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type MenuItemDelegate = {
  create(args: object): Promise<MenuItemRecord>;
  findFirst(args: object): Promise<MenuItemRecord | null>;
  update(args: object): Promise<MenuItemRecord>;
};

type MenuItemPrismaClient = {
  menuItem: MenuItemDelegate;
  menuCategory: {
    findFirst(args: object): Promise<object | null>;
  };
};

@Injectable()
export class MenuItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): MenuItemPrismaClient {
    return this.prisma;
  }

  async create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const item = await this.db.menuItem.create({
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

  async findOne(id: string): Promise<MenuItem | null> {
    const item = await this.db.menuItem.findFirst({
      where: { id, isDeleted: false },
    });

    return item ? this.mapToEntity(item) : null;
  }

  /**
   * Modifie un article existant
   */
  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem | null> {
    const item = await this.prisma.menuItem.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
        ...(dto.isPopular !== undefined && { isPopular: dto.isPopular }),
        ...(dto.isVegetarian !== undefined && {
          isVegetarian: dto.isVegetarian,
        }),
        ...(dto.isVegan !== undefined && { isVegan: dto.isVegan }),
        ...(dto.isGlutenFree !== undefined && {
          isGlutenFree: dto.isGlutenFree,
        }),
        ...(dto.isHalal !== undefined && { isHalal: dto.isHalal }),
        ...(dto.isKosher !== undefined && { isKosher: dto.isKosher }),
        ...(dto.preparationTime !== undefined && {
          preparationTime: dto.preparationTime,
        }),
        ...(dto.calories !== undefined && { calories: dto.calories }),
        ...(dto.allergens !== undefined && { allergens: dto.allergens }),
        ...(dto.ingredients !== undefined && { ingredients: dto.ingredients }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });

    return this.mapToEntity(item);
  }

  async softDelete(id: string): Promise<MenuItem | null> {
    const item = await this.db.menuItem.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return this.mapToEntity(item);
  }

  async menuCategoryExists(menuCategoryId: string): Promise<boolean> {
    const category = await this.db.menuCategory.findFirst({
      where: { id: menuCategoryId, isDeleted: false },
    });

    return category !== null;
  }

  private mapToEntity(data: MenuItemRecord): MenuItem {
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
      allergens: data.allergens,
      ingredients: data.ingredients,
      sortOrder: data.sortOrder,
      isDeleted: data.isDeleted,
      deletedAt: data.deletedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
