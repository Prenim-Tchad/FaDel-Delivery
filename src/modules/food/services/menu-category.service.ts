import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MenuCategoryRepository } from '../repositories/menu-category.repository';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';

/**
 * Service MenuCategory — contient toute la logique métier
 *
 * Flux : Controller → Service → Repository → données
 */
@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly menuCategoryRepository: MenuCategoryRepository,
  ) {}

  /**
   * Crée une catégorie de menu pour un restaurant donné
   * POST /food/restaurants/:id/menu-categories
   */
  create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): MenuCategory {
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

    return this.menuCategoryRepository.create(restaurantId, dto);
  }

  /**
   * Modifie une catégorie existante
   * PUT /food/menu-categories/:id
   */
  update(id: string, dto: UpdateMenuCategoryDto): MenuCategory {
    // Vérification que la catégorie existe
    const existing = this.menuCategoryRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Catégorie avec l'ID ${id} introuvable ou déjà supprimée`,
      );
    }

    // Validation du sort_order si fourni
    if (dto.sort_order !== undefined && dto.sort_order < 0) {
      throw new BadRequestException(
        "L'ordre d'affichage ne peut pas être négatif",
      );
    }

    const updated = this.menuCategoryRepository.update(id, dto);
    if (!updated) {
      throw new BadRequestException(
        'Échec de la modification de la catégorie',
      );
    }

    return updated;
  }

  /**
   * Supprime une catégorie (soft-delete)
   * DELETE /food/menu-categories/:id
   *
   * Le soft-delete ne supprime pas réellement la donnée —
   * il la marque comme supprimée (isDeleted: true)
   * pour garder l'historique et éviter les pertes de données
   */
  remove(id: string): MenuCategory {
    // Vérification que la catégorie existe
    const existing = this.menuCategoryRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Catégorie avec l'ID ${id} introuvable ou déjà supprimée`,
      );
    }

    const deleted = this.menuCategoryRepository.softDelete(id);
    if (!deleted) {
      throw new BadRequestException(
        'Échec de la suppression de la catégorie',
      );
    }

    return deleted;
  }
}
