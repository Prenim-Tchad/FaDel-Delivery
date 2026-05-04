import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
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
import { UpdateMenuItemDto } from '../dtos/update-menu-item.dto';
import { MenuItem } from '../entities/menu-item.entity';

/**
 * Controller MenuItem — gère les requêtes HTTP des articles de menu
 *
 * Routes :
 * POST   /food/menu-categories/:id/items → créer un article
 * PUT    /food/menu-items/:id            → modifier un article
 * DELETE /food/menu-items/:id            → soft-delete un article
 */
@ApiTags('food - menu items')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  /**
   * POST /food/menu-categories/:id/items
   * Crée un nouvel article dans une catégorie de menu
   */
  @Post('menu-categories/:id/items')
  @ApiOperation({
    summary: 'Créer un article dans une catégorie de menu',
    description:
      'Crée un article avec nom, prix FCFA, description, disponibilité et popularité.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la catégorie de menu',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.CREATED, // 201
    description: 'Article créé avec succès',
    type: MenuItem,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie introuvable',
  })
  create(
    @Param('id') menuCategoryId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.create(menuCategoryId, createMenuItemDto);
  }

  /**
   * PUT /food/menu-items/:id
   * Modifie un article existant
   */
  @Put('menu-items/:id')
  @ApiOperation({
    summary: 'Modifier un article de menu',
    description:
      "Modifie les informations d'un article (nom, prix, description, disponibilité, etc.).",
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, // 400
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND, // 404
    description: 'Catégorie de menu introuvable',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article modifié avec succès',
    type: MenuItem,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article introuvable',
  })
  update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  /**
   * DELETE /food/menu-items/:id
   * Soft-delete d'un article (ne supprime pas réellement)
   */
  @Delete('menu-items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un article de menu (soft-delete)',
    description:
      "Marque l'article comme supprimé sans le supprimer réellement de la base.",
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'article",
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article supprimé avec succès',
    type: MenuItem,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article introuvable',
  })
  remove(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemService.remove(id);
  }
}
