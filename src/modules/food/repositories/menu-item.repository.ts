import { Injectable } from '@nestjs/common';
import { MenuItem } from '../entities/menu-item.entity';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';

/**
 * Repository MenuItem — gère l'accès aux données des articles de menu
 *
 * ⚠️ Stockage en mémoire temporaire
 * Quand Prisma sera prêt, remplacer par :
 * constructor(private readonly prisma: PrismaService) {}
 * return await this.prisma.menuItem.create({ data: { ... } });
 */
@Injectable()
export class MenuItemRepository {
  // Stockage en mémoire (sera remplacé par Prisma + PostgreSQL)
  private items: MenuItem[] = [];
  private nextId = 1;

  /**
   * Crée un nouvel article dans une catégorie de menu
   * @param menuCategoryId - ID de la catégorie (vient du param :id de la route)
   * @param dto - Données validées par CreateMenuItemDto
   */
  create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): MenuItem {
    const item: MenuItem = {
      id: this.generateId(),
      menuCategoryId,               // ID de la catégorie parente
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      isAvailable: dto.isAvailable ?? true,   // true par défaut
      isPopular: dto.isPopular ?? false,       // false par défaut
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
      isDeleted: false,             // non supprimé par défaut
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(item);
    return item;
  }

  /**
   * Vérifie si une catégorie de menu existe
   * @param menuCategoryId - ID de la catégorie à vérifier
   *
   * ⚠️ Temporaire : retourne toujours true
   * Quand Prisma sera prêt :
   * const category = await this.prisma.menuCategory.findUnique({
   *   where: { id: menuCategoryId, isDeleted: false }
   * });
   * return !!category;
   */
  menuCategoryExists(_menuCategoryId: string): boolean {
    // TODO: remplacer par vérification Prisma
    // Le _ devant le paramètre indique à TypeScript qu'on sait
    // qu'il n'est pas utilisé pour l'instant (évite l'erreur lint)
    return true;
  }

  /**
   * Génère un ID unique temporaire (sera remplacé par UUID Prisma)
   */
  private generateId(): string {
    return `menuitem_${this.nextId++}_${Date.now()}`;
  }
}