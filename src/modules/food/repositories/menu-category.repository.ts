import { Injectable } from '@nestjs/common';
import { MenuCategory } from '../entities/menu-category.entity';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';

/**
 * Repository MenuCategory — gère l'accès aux données
 *
 * Un Repository sert à :
 * 1. Isoler la logique d'accès aux données du reste du code
 * 2. Faciliter le remplacement du stockage (mémoire → Prisma/PostgreSQL)
 * 3. Garder le Service propre (pas de logique BDD dans le service)
 *
 * ⚠️ Amélioration prévue : stockage en mémoire temporaire
 * Quand le schema Prisma sera prêt, remplacer par :
 * constructor(private readonly prisma: PrismaService) {}
 * return await this.prisma.menuCategory.create({ data: { ... } });
 */
@Injectable()
export class MenuCategoryRepository {
  // Stockage en mémoire (données perdues au redémarrage)
  // Sera remplacé par Prisma + PostgreSQL
  private categories: MenuCategory[] = [];
  private nextId = 1;

  /**
   * Crée une nouvelle catégorie de menu pour un restaurant
   * @param restaurantId - ID du restaurant (vient du param :id de la route)
   * @param dto - Données validées (nom FR/EN/AR/ES, description, sort_order)
   * @returns La catégorie créée avec son id et ses timestamps
   */
  async create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const category: MenuCategory = {
      id: this.generateId(),       // ID temporaire, sera UUID avec Prisma
      restaurantId,                // ID du restaurant passé en paramètre
      name: dto.name,              // Objet multilingue { fr, en, ar, es }
      description: dto.description, // Optionnel
      sort_order: dto.sort_order,  // Ordre d'affichage
      createdAt: new Date(),       // Date actuelle
      updatedAt: new Date(),       // Date actuelle
    };

    // Sauvegarde en mémoire
    this.categories.push(category);
    return category;
  }

  /**
   * Vérifie si un restaurant existe
   * @param restaurantId - ID du restaurant à vérifier
   * @returns true si le restaurant existe, false sinon
   *
   * ⚠️ Temporaire : retourne toujours true
   * Quand Prisma sera prêt :
   * const restaurant = await this.prisma.restaurant.findUnique({
   *   where: { id: restaurantId }
   * });
   * return !!restaurant;
   */
  async restaurantExists(restaurantId: string): Promise<boolean> {
    return true; // TODO: remplacer par vérification Prisma
  }

  /**
   * Génère un ID unique temporaire
   * Sera remplacé par les UUIDs auto-générés de Prisma
   */
  private generateId(): string {
    return `menucat_${this.nextId++}_${Date.now()}`;
  }
}