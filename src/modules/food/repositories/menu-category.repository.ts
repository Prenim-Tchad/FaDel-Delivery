
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
<<<<<<< HEAD
  create(restaurantId: string, dto: CreateMenuCategoryDto): MenuCategory {
    const category: MenuCategory = {
      id: this.generateId(),
      restaurantId,
      name: dto.name,
      description: dto.description,
      sort_order: dto.sort_order,
      isDeleted: false, // par défaut non supprimé
      deletedAt: null, // par défaut pas de date de suppression
      createdAt: new Date(),
      updatedAt: new Date(),
    };
=======
  async create(
  restaurantId: string,
  dto: CreateMenuCategoryDto,
): Promise<MenuCategory> {
  const name = dto.name as unknown as Prisma.InputJsonValue;
  const description = dto.description
    ? (dto.description as unknown as Prisma.InputJsonValue)
    : Prisma.JsonNull; // 🆕 Prisma.JsonNull au lieu de null
>>>>>>> ebec9c1f957e06ace8ff134540545740bff8dca3

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
<<<<<<< HEAD
  findOne(id: string): MenuCategory | null {
    return (
      this.categories.find(
        (c) => c.id === id && !c.isDeleted, // exclut les supprimés
      ) ?? null
    );
=======
  async findOne(id: string): Promise<MenuCategory | null> {
    const category = await this.prisma.menuCategory.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) return null;
    return this.mapToEntity(category);
>>>>>>> ebec9c1f957e06ace8ff134540545740bff8dca3
  }

  /**
   * Modifie une catégorie existante
   */
<<<<<<< HEAD
  update(id: string, dto: UpdateMenuCategoryDto): MenuCategory | null {
    const index = this.categories.findIndex((c) => c.id === id && !c.isDeleted);
=======
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
>>>>>>> ebec9c1f957e06ace8ff134540545740bff8dca3

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
<<<<<<< HEAD
  softDelete(id: string): MenuCategory | null {
    const index = this.categories.findIndex((c) => c.id === id && !c.isDeleted);

    if (index === -1) return null;

    // On marque comme supprimé au lieu de supprimer
    this.categories[index] = {
      ...this.categories[index],
      isDeleted: true, // marqué comme supprimé
      deletedAt: new Date(), // date de suppression
      updatedAt: new Date(),
    };

    return this.categories[index];
=======
  async softDelete(id: string): Promise<MenuCategory | null> {
    const category = await this.prisma.menuCategory.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return this.mapToEntity(category);
>>>>>>> ebec9c1f957e06ace8ff134540545740bff8dca3
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