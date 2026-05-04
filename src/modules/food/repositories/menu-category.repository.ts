import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';

type MenuCategoryRecord = {
  id: string;
  restaurantId: string;
  name: unknown;
  description: unknown;
  sortOrder: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type MenuCategoryDelegate = {
  create(args: object): Promise<MenuCategoryRecord>;
  findFirst(args: object): Promise<MenuCategoryRecord | null>;
  update(args: object): Promise<MenuCategoryRecord>;
};

type MenuCategoryPrismaClient = {
  menuCategory: MenuCategoryDelegate;
  restaurant: {
    findUnique(args: object): Promise<object | null>;
  };
};

@Injectable()
export class MenuCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get db(): MenuCategoryPrismaClient {
    return this.prisma;
  }

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

    return this.mapToEntity(category);
  }

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
    const category = await this.db.menuCategory.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return this.mapToEntity(category);
  }

  async restaurantExists(restaurantId: string): Promise<boolean> {
    const restaurant = await this.db.restaurant.findUnique({
      where: { id: restaurantId },
    });

    return restaurant !== null;
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
