import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
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
import { OptionGroupService } from '../services/option-group.service';
import { CreateOptionGroupDto } from '../dtos/create-option-group.dto';

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
  // constructeur
  constructor(
    private readonly menuItemService: MenuItemService,
    private readonly optionGroupService: OptionGroupService,
  ) {}

  /**
   * POST /food/menu-categories/:id/items
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
    status: HttpStatus.CREATED,
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
   */
  @Put('menu-items/:id')
  @ApiOperation({
    summary: 'Modifier un article de menu',
    description:
      "Modifie les informations d'un article (nom, prix, description, disponibilité, etc.).",
  })
  @ApiParam({ name: 'id', description: "ID de l'article", example: 'clxxx123' })
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
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.update(id, updateMenuItemDto);
  }

  /**
   * DELETE /food/menu-items/:id
   */
  @Delete('menu-items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un article de menu (soft-delete)',
    description:
      "Marque l'article comme supprimé sans le supprimer réellement de la base.",
  })
  @ApiParam({ name: 'id', description: "ID de l'article", example: 'clxxx123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article supprimé avec succès',
    type: MenuItem,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article introuvable',
  })
  async remove(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemService.remove(id);
  }

  /**
   * POST /food/menu-items/:id/option-groups
   */
  @Post('menu-items/:id/option-groups')
  @ApiOperation({
    summary: "Créer un groupe d'options pour un article",
    description:
      "Crée un groupe d'options (ex: Taille, Garnitures) en mode SINGLE ou MULTIPLE.",
  })
  @ApiParam({ name: 'id', description: "ID de l'article", example: 'clxxx123' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Groupe créé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article introuvable',
  })
  async createOptionGroup(
    @Param('id') menuItemId: string,
    @Body() dto: CreateOptionGroupDto,
  ) {
    return this.optionGroupService.create(menuItemId, dto);
  }

  /**
   * GET /food/menu-items/:id/option-groups
   */
  @Get('menu-items/:id/option-groups')
  @ApiOperation({ summary: "Lister les groupes d'options d'un article" })
  @ApiParam({ name: 'id', description: "ID de l'article", example: 'clxxx123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Liste des groupes d'options",
  })
  async findOptionGroups(@Param('id') menuItemId: string) {
    return this.optionGroupService.findAllByMenuItem(menuItemId);
  }

  /**
   * PATCH /food/menu-items/:id/availability
   */
  @Patch('menu-items/:id/availability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Mettre à jour la disponibilité d'un article",
    description:
      "Change l'état : AVAILABLE, HIDDEN (masqué) ou OUT_OF_STOCK (grisé).",
  })
  @ApiParam({ name: 'id', description: "ID de l'article", example: 'clxxx123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Disponibilité mise à jour',
    type: MenuItem,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article introuvable',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  // ✅ Fix error 197 — removed unnecessary `async` since we directly return the promise
  updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
  ): Promise<MenuItem> {
    return this.menuItemService.updateAvailability(id, dto.availability);
  }
}
