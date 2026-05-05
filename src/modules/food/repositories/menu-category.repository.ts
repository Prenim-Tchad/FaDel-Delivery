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
  // Stockage en mémoire (sera remplacé par Prisma + PostgreSQL)
  private categories: MenuCategory[] = [];
  private nextId = 1;

  /**
   * Crée une nouvelle catégorie de menu
   */
  create(restaurantId: string, dto: CreateMenuCategoryDto): MenuCategory {
    const category: MenuCategory = {
      id: this.generateId(),
      restaurantId,
      name: dto.name,
      description: dto.description,
      sort_order: dto.sort_order,
      isDeleted: false,   // par défaut non supprimé
      deletedAt: null,    // par défaut pas de date de suppression
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(category);
    return category;
  }

  /**
   * Trouve une catégorie par ID (exclut les soft-deleted)
   */
  findOne(id: string): MenuCategory | null {
    return this.categories.find(
      (c) => c.id === id && !c.isDeleted  // exclut les supprimés
    ) ?? null;
  }

  /**
   * Modifie une catégorie existante
   */
  update(id: string, dto: UpdateMenuCategoryDto): MenuCategory | null {
    const index = this.categories.findIndex(
      (c) => c.id === id && !c.isDeleted
    );

    if (index === -1) return null;

    // On fusionne les anciennes données avec les nouvelles
    this.categories[index] = {
      ...this.categories[index],
      ...dto,
      updatedAt: new Date(), // mise à jour de la date
    };

    return this.mapToEntity(category);
  }

  /**
   * Soft-delete : marque la catégorie comme supprimée
   * sans la supprimer réellement de la base de données
   */
  softDelete(id: string): MenuCategory | null {
    const index = this.categories.findIndex(
      (c) => c.id === id && !c.isDeleted
    );

    if (index === -1) return null;

    // On marque comme supprimé au lieu de supprimer
    this.categories[index] = {
      ...this.categories[index],
      isDeleted: true,        // marqué comme supprimé
      deletedAt: new Date(),  // date de suppression
      updatedAt: new Date(),
    };

    return this.mapToEntity(category);
  }

  async restaurantExists(restaurantId: string): Promise<boolean> {
    const restaurant = await this.db.restaurant.findUnique({
      where: { id: restaurantId },
    });

    return restaurant !== null;
  }

  private mapToEntity(data: MenuCategoryRecord): MenuCategory {
    return {
      id: data.id,
      restaurantId: data.restaurantId,
      name: data.name as MenuCategory['name'],
      description: data.description
        ? (data.description as MenuCategory['description'])
        : undefined,
      sort_order: data.sortOrder,
      isDeleted: data.isDeleted,
      deletedAt: data.deletedAt ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
