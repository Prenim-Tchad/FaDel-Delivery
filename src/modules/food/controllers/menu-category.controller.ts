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
    summary: 'Creer une categorie de menu pour un restaurant',
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
  @ApiOperation({ summary: 'Modifier une categorie de menu' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer une categorie de menu (soft-delete)' })
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
