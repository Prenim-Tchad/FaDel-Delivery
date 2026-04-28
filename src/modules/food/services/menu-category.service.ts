import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MenuCategoryRepository } from '../repositories/menu-category.repository';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';

/**
 * Service MenuCategory — contient toute la logique métier
 *
 * Un Service sert à :
 * 1. Appliquer les règles métier (validations, vérifications)
 * 2. Faire le lien entre le Controller et le Repository
 * 3. Garder le Controller propre (pas de logique dans le controller)
 *
 * Flux : Controller → Service → Repository → BDD
 */
@Injectable()
export class MenuCategoryService {
  constructor(
    // Injection du repository pour accéder aux données
    private readonly menuCategoryRepository: MenuCategoryRepository,
  ) {}

  /**
   * Crée une catégorie de menu pour un restaurant donné
   * @param restaurantId - ID du restaurant (vient du param :id de la route)
   * @param dto - Données validées par CreateMenuCategoryDto
   * @returns La catégorie créée
   */
  async create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      // Règle métier 1 : vérifier que le restaurant existe
      const exists =
        await this.menuCategoryRepository.restaurantExists(restaurantId);
      if (!exists) {
        throw new NotFoundException(
          `Restaurant avec l'ID ${restaurantId} introuvable`,
        );
      }

      // Règle métier 2 : sort_order ne peut pas être négatif
      // (déjà validé par @Min(0) dans le DTO, double sécurité ici)
      if (dto.sort_order < 0) {
        throw new BadRequestException(
          "L'ordre d'affichage ne peut pas être négatif",
        );
      }

      // Création de la catégorie via le repository
      return await this.menuCategoryRepository.create(restaurantId, dto);

    } catch (error) {
      // On laisse passer les erreurs métier connues telles quelles
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Toute autre erreur inattendue
      throw new BadRequestException(
        'Échec de la création de la catégorie de menu',
      );
    }
  }
}