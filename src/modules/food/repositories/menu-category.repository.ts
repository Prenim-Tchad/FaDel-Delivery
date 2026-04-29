import { Injectable } from '@nestjs/common';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';

/**
 * Repository MenuCategory — gère l'accès aux données
 *
 * ⚠️ Stockage en mémoire temporaire
 * Quand Prisma sera prêt, remplacer par PrismaService
 */
@Injectable()
export class MenuCategoryRepository {
  // Stockage en mémoire (sera remplacé par Prisma + PostgreSQL)
  private categories: MenuCategory[] = [];
  private nextId = 1;

  /**
   * Crée une nouvelle catégorie de menu
   */
  create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): MenuCategory {
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

    return this.categories[index];
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

    return this.categories[index];
  }

  /**
   * Vérifie si un restaurant existe (temporaire)
   */
  restaurantExists(): boolean {
    // TODO: remplacer par this.prisma.restaurant.findUnique(...)
    return true;
  }

  /**
   * Génère un ID unique temporaire (sera remplacé par UUID Prisma)
   */
  private generateId(): string {
    return `menucat_${this.nextId++}_${Date.now()}`;
  }
}