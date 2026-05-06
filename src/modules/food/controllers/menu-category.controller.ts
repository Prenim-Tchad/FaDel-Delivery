import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMenuCategoryDto } from '../dtos/create-menu-category.dto';
import { UpdateMenuCategoryDto } from '../dtos/update-menu-category.dto';
import { MenuCategory } from '../entities/menu-category.entity';
import { MenuCategoryService } from '../services/menu-category.service';

@ApiTags('food - menu categories')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post('restaurants/:id/menu-categories')
  @ApiOperation({
    summary: 'Créer une catégorie de menu pour un restaurant',
    description:
      'Crée une catégorie avec nom multilingue (FR/EN/AR/ES), description et ordre.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du restaurant',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Categorie creee avec succes',
    type: MenuCategory,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant introuvable',
  })
  async create(
    @Param('id') restaurantId: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.create(restaurantId, createMenuCategoryDto);
  }

  @Put('menu-categories/:id')
  @ApiOperation({
    summary: 'Modifier une catégorie de menu',
    description: "Modifie le nom, la description ou l'ordre d'une catégorie.",
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categorie',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorie modifiee avec succes',
    type: MenuCategory,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie introuvable',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.update(id, updateMenuCategoryDto);
  }

  @Delete('menu-categories/:id')
  @HttpCode(HttpStatus.OK) // 200 car on retourne la catégorie supprimée
  @ApiOperation({
    summary: 'Supprimer une catégorie de menu (soft-delete)',
    description:
      'Marque la catégorie comme supprimée sans la supprimer réellement de la base.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la categorie',
    example: 'clxxx123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categorie supprimee avec succes',
    type: MenuCategory,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie introuvable',
  })
  async remove(@Param('id') id: string): Promise<MenuCategory> {
    return this.menuCategoryService.remove(id);
  }
}
