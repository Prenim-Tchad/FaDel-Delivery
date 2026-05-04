import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MenuItemService } from '../services/menu-item.service';
import { CreateMenuItemDto } from '../dtos/create-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';

/**
 * Controller MenuItem — gère les requêtes HTTP des articles de menu
 *
 * Routes :
 * POST /food/menu-categories/:id/items → créer un article
 */
@ApiTags('food - menu items')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class MenuItemController {
  constructor(
    private readonly menuItemService: MenuItemService,
  ) {}

  /**
   * POST /food/menu-categories/:id/items
   * Crée un nouvel article dans une catégorie de menu
   */
  @Post('menu-categories/:id/items')
  @ApiOperation({
    summary: 'Créer un article dans une catégorie de menu',
    description: 'Crée un article avec nom, prix FCFA, description, disponibilité et popularité.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la catégorie de menu',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article créé avec succès',
    type: MenuItem,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catégorie introuvable' })
  create(
  @Param('id') menuCategoryId: string,
  @Body() createMenuItemDto: CreateMenuItemDto,
): Promise<MenuItem> {
  return this.menuItemService.create(menuCategoryId, createMenuItemDto);
}
}