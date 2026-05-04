import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateOptionGroupDto } from '../dtos/create-option-group.dto';
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
  constructor(
    private readonly menuItemService: MenuItemService,
  ) {}

  /**
   * POST /food/menu-categories/:id/items
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

  /**
   * PUT /food/menu-items/:id
   */
  @Put('menu-items/:id')
  @ApiOperation({
    summary: 'Modifier un article de menu',
    description: 'Modifie les informations d\'un article (nom, prix, description, disponibilité, etc.).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'article',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article modifié avec succès',
    type: MenuItem,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Article introuvable' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.update(id, updateMenuItemDto);
  }


  /**
   * Tâche #36 : API POST pour ajouter des groupes d'options (ex: 'Taille', 'Garnitures')
   */
  @Post(':id/option-groups')
  @ApiOperation({ summary: "Ajouter un groupe d'options (Tâche #36)" })
  @ApiParam({ name: 'id', description: "ID de l'article de menu" })
  @ApiResponse({ status: 201, description: 'Groupe d’options créé avec succès' })
  async addOptionGroup(
    @Param('id') id: string,
    @Body() dto: CreateOptionGroupDto
  ) {
    // Vérification de l'existence de l'article (évite d'ajouter des options à un article inexistant)
    const item = await this.menuItemService.findOne(id);
    
    if (!item) {
      throw new NotFoundException(`L'article avec l'ID ${id} n'existe pas.`);
    }

    return this.menuItemService.addOptionGroup(id, dto);
  }

  /**
   * DELETE /food/menu-items/:id
   */
  @Delete('menu-items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un article de menu (soft-delete)',
    description: 'Marque l\'article comme supprimé sans le supprimer réellement de la base.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'article',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article supprimé avec succès',
    type: MenuItem,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Article introuvable' })
  async remove(
    @Param('id') id: string,
  ): Promise<MenuItem> {
    return this.menuItemService.remove(id);
  }
}