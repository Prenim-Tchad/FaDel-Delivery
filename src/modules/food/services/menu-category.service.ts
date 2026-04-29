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
 */
@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly menuCategoryRepository: MenuCategoryRepository,
  ) {}

  /**
   * Crée une catégorie de menu pour un restaurant donné
   */
  create(
  restaurantId: string,
  dto: CreateMenuCategoryDto,
): MenuCategory {
    try {
      // Vérification que le restaurant existe
      const exists = this.menuCategoryRepository.restaurantExists();
      if (!exists) {
        throw new NotFoundException(
          `Restaurant avec l'ID ${restaurantId} introuvable`,
        );
      }

      // Validation du sort_order
      if (dto.sort_order < 0) {
        throw new BadRequestException(
          "L'ordre d'affichage ne peut pas être négatif",
        );
      }

      // Création de la catégorie
      return this.menuCategoryRepository.create(restaurantId, dto);

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Échec de la création de la catégorie de menu',
      );
    }
  }
}