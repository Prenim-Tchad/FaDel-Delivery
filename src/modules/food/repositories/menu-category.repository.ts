import { Injectable } from '@nestjs/common';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';

/**
 * Repository MenuCategory — gère l'accès aux données
 *
 * ⚠️ Stockage en mémoire temporaire
 * Quand Prisma sera prêt, remplacer par :
 * constructor(private readonly prisma: PrismaService) {}
 * return await this.prisma.menuCategory.create({ data: { ... } });
 */
@Injectable()
export class MenuCategoryRepository {
  // Stockage en mémoire (sera remplacé par Prisma + PostgreSQL)
  private categories: MenuCategory[] = [];
  private nextId = 1;

  /**
   * Crée une nouvelle catégorie de menu
   * Synchrone car pas encore de BDD (in-memory)
   */
  create(restaurantId: string, dto: CreateMenuCategoryDto): MenuCategory {
    const category: MenuCategory = {
      id: this.generateId(),
      restaurantId,
      name: dto.name,
      description: dto.description,
      sort_order: dto.sort_order,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.categories.push(category);
    return category;
  }

  /**
   * Vérifie si un restaurant existe
   * Retourne toujours true (temporaire, sera remplacé par Prisma)
   */
  restaurantExists(): boolean {
    // TODO: quand Prisma est prêt →
    // return !!(await this.prisma.restaurant.findUnique({ where: { id: restaurantId } }));
    return true;
  }

  /**
   * Génère un ID unique temporaire (sera remplacé par UUID Prisma)
   */
  private generateId(): string {
    return `menucat_${this.nextId++}_${Date.now()}`;
  }
}
