import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
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
import { MenuCategoryService } from '../services/menu-category.service';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';

/**
 * Controller MenuCategory — gère les requêtes HTTP
 *
 * Routes :
 * POST   /food/restaurants/:id/menu-categories → créer
 * PUT    /food/menu-categories/:id             → modifier
 * DELETE /food/menu-categories/:id             → soft-delete
 */
@ApiTags('food - menu categories')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  /**
   * POST /food/restaurants/:id/menu-categories
   */
  @Post('restaurants/:id/menu-categories')
  @ApiOperation({
    summary: 'Créer une catégorie de menu pour un restaurant',
    description:
      'Crée une catégorie avec nom multilingue (FR/EN/AR/ES), description et ordre.',
  })
  @ApiOperation({ summary: 'Créer une catégorie de menu pour un restaurant' })
  @ApiParam({
    name: 'id',
    description: 'UUID du restaurant',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Catégorie créée avec succès',
    type: MenuCategory,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Restaurant introuvable' })
  async create(
    @Param('id', ParseUUIDPipe) restaurantId: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.create(restaurantId, createMenuCategoryDto);
  }

  /**
   * PUT /food/menu-categories/:id
   */
  @Put('menu-categories/:id')
  @ApiOperation({
    summary: 'Modifier une catégorie de menu',
    description: "Modifie le nom, la description ou l'ordre d'une catégorie.",
  })
  @ApiOperation({ summary: 'Modifier une catégorie de menu' })
  @ApiParam({
    name: 'id',
    description: 'ID de la catégorie',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catégorie modifiée avec succès',
    type: MenuCategory,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Données invalides' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catégorie introuvable' })
  async update(
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.update(id, updateMenuCategoryDto);
  }

  /**
   * DELETE /food/menu-categories/:id
   */
  @Delete('menu-categories/:id')
  @HttpCode(HttpStatus.OK) // 200 car on retourne la catégorie supprimée
  @ApiOperation({
    summary: 'Supprimer une catégorie de menu (soft-delete)',
    description:
      'Marque la catégorie comme supprimée sans la supprimer réellement de la base.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une catégorie de menu (soft-delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la catégorie',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catégorie supprimée avec succès',
    type: MenuCategory,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie introuvable',
  })
  remove(@Param('id') id: string): MenuCategory {
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Catégorie introuvable' })
  async remove(@Param('id') id: string): Promise<MenuCategory> {
    return this.menuCategoryService.remove(id);
  }
}