import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MenuItemRepository } from '../repositories/menu-item.repository';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';
import { AvailabilityStatus } from '../dtos/update-availability.dto';

/**
 * Service MenuItem — contient toute la logique métier
 * Flux : Controller → Service → Repository → Prisma → PostgreSQL
 */
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
        `Catégorie de menu avec l'ID ${menuCategoryId} introuvable`,
      );
    }
    if (dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas être négatif');
    }
    if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
      throw new BadRequestException(
        'Le temps de préparation ne peut pas être négatif',
      );
    }
    return this.menuItemRepository.create(menuCategoryId, dto);
  }

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuItemRepository.findOne(id);
    if (!item) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou déjà supprimé`,
      );
    }
    return item;
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const existing = await this.menuItemRepository.findOne(id);
    if (!existing) {
      throw new NotFoundException(
        `Article avec l'ID ${id} introuvable ou déjà supprimé`,
      );
    }
    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Le prix ne peut pas être négatif');
    }
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

  async remove(id: string): Promise<MenuItem> {
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
