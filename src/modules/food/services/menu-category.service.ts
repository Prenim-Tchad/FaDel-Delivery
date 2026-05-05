import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuCategoryRepository } from '../repositories/menu-category.repository';

@Injectable()
export class MenuCategoryService {
  constructor(
    private readonly menuCategoryRepository: MenuCategoryRepository,
  ) {}

  /**
   * Crée une catégorie de menu pour un restaurant donné
   * POST /food/restaurants/:id/menu-categories
   */
  async create(
    restaurantId: string,
    dto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const exists =
      await this.menuCategoryRepository.restaurantExists(restaurantId);
    if (!exists) {
      throw new NotFoundException(
        `Restaurant avec l'ID ${restaurantId} introuvable`,
      );
    }

    if (dto.sort_order < 0) {
      throw new BadRequestException(
        "L'ordre d'affichage ne peut pas etre negatif",
      );
    }

    return this.menuCategoryRepository.create(restaurantId, dto);
  }

  async update(id: string, dto: UpdateMenuCategoryDto): Promise<MenuCategory> {
    const existing = await this.menuCategoryRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Categorie avec l'ID ${id} introuvable ou deja supprimee`,
      );
    }

    if (dto.sort_order !== undefined && dto.sort_order < 0) {
      throw new BadRequestException(
        "L'ordre d'affichage ne peut pas etre negatif",
      );
    }

    const updated = await this.menuCategoryRepository.update(id, dto);
    if (!updated) {
      throw new BadRequestException('Échec de la modification de la catégorie');
    }

    return updated;
  }

  async remove(id: string): Promise<MenuCategory> {
    const existing = await this.menuCategoryRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Categorie avec l'ID ${id} introuvable ou deja supprimee`,
      );
    }

    const deleted = await this.menuCategoryRepository.softDelete(id);
    if (!deleted) {
      throw new BadRequestException('Échec de la suppression de la catégorie');
    }

    return deleted;
  }
}
