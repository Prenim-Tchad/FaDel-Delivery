import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MenuItemRepository } from '../repositories/menu-item.repository';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';

/**
 * Service MenuItem — contient toute la logique métier
 *
 * Flux : Controller → Service → Repository → Prisma → PostgreSQL
 */
@Injectable()
export class MenuItemService {
  constructor(private readonly menuItemRepository: MenuItemRepository) {}

  /**
   * Crée un article dans une catégorie de menu
   * POST /food/menu-categories/:id/items
   */
  create(menuCategoryId: string, dto: CreateMenuItemDto): MenuItem {
    // Règle métier 1 : vérifier que la catégorie existe
    const exists = this.menuItemRepository.menuCategoryExists();
  async create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    // Vérification que la catégorie existe en BDD
    const exists = await this.menuItemRepository.menuCategoryExists(menuCategoryId);
    if (!exists) {
      throw new NotFoundException(
        `Catégorie de menu avec l'ID ${menuCategoryId} introuvable`,
      );
    }

    // Le prix doit être positif
    if (dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas être négatif');
    }

    // Le temps de préparation doit être positif
    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de préparation ne peut pas être négatif',
      );
    }

    return this.menuItemRepository.create(menuCategoryId, dto);
  }

  /**
   * Modifie un article existant
   * PUT /food/menu-items/:id
   */
  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    // Vérification que l'article existe
    const existing = await this.menuItemRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou déjà supprimé`,
      );
    }

    // Validation du prix si fourni
    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas être négatif');
    }

    // Validation du temps de préparation si fourni
    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de préparation ne peut pas être négatif',
      );
    }

    const updated = await this.menuItemRepository.update(id, dto);
    if (!updated) {
      throw new BadRequestException("Échec de la modification de l'article");
    }

    return updated;
  }

  /**
   * Supprime un article (soft-delete)
   * DELETE /food/menu-items/:id
   */
  async remove(id: string): Promise<MenuItem> {
    // Vérification que l'article existe
    const existing = await this.menuItemRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou déjà supprimé`,
      );
    }

    const deleted = await this.menuItemRepository.softDelete(id);
    if (!deleted) {
      throw new BadRequestException("Échec de la suppression de l'article");
    }

    return deleted;
  }
}
