import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';
import { MenuItemRepository } from '../repositories/menu-item.repository';

@Injectable()
export class MenuItemService {
  constructor(private readonly menuItemRepository: MenuItemRepository) {}

  async create(
    menuCategoryId: string,
    dto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const exists =
      await this.menuItemRepository.menuCategoryExists(menuCategoryId);
    if (!exists) {
      throw new NotFoundException(
        `Categorie de menu avec l'ID ${menuCategoryId} introuvable`,
      );
    }

    if (dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas etre negatif');
    }

    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de preparation ne peut pas etre negatif',
      );
    }

    return this.menuItemRepository.create(menuCategoryId, dto);
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const existing = await this.menuItemRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou deja supprime`,
      );
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas etre negatif');
    }

    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de preparation ne peut pas etre negatif',
      );
    }

    const updated = await this.menuItemRepository.update(id, dto);
    if (!updated) {
      throw new BadRequestException("Echec de la modification de l'article");
    }

    return updated;
  }

  async remove(id: string): Promise<MenuItem> {
    const existing = await this.menuItemRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou deja supprime`,
      );
    }

    const deleted = await this.menuItemRepository.softDelete(id);
    if (!deleted) {
      throw new BadRequestException("Echec de la suppression de l'article");
    }

    return deleted;
  }
}
