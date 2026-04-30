import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MenuItemRepository } from '../repositories/menu-item.repository';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';

/**
 * Service MenuItem — contient toute la logique métier
 */
@Injectable()
export class MenuItemService {
  constructor(
    private readonly menuItemRepository: MenuItemRepository,
  ) {}

  /**
   * Crée un article dans une catégorie de menu
   * POST /food/menu-categories/:id/items
   */
  async create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    // Règle métier 1 : vérifier que la catégorie existe en BDD
    const exists = await this.menuItemRepository.menuCategoryExists(menuCategoryId);

    if (!exists) {
      throw new NotFoundException(
        `Catégorie de menu avec l'ID ${menuCategoryId} introuvable`,
      );
    }

    // Règle métier 2 : le prix doit être positif
    if (dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas être négatif');
    }

    // Règle métier 3 : le temps de préparation doit être positif
    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de préparation ne peut pas être négatif',
      );
    }

    return this.menuItemRepository.create(menuCategoryId, dto);
  }
}