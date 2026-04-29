import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
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
import { MenuCategory } from '../entities/menu-category.entity';

/**
 * Controller MenuCategory — gère les requêtes HTTP
 *
 * Un Controller sert à :
 * 1. Recevoir les requêtes HTTP du client
 * 2. Valider les paramètres de route (:id)
 * 3. Passer les données au Service
 * 4. Retourner la réponse au client
 *
 * Il ne contient AUCUNE logique métier → tout est dans le Service
 */
@ApiTags('food - menu categories') // Groupe dans Swagger UI
@ApiBearerAuth('JWT-auth') // Indique que la route nécessite un token JWT
@Controller('food/restaurants') // Préfixe de base : /food/restaurants
export class MenuCategoryController {
  constructor(
    // Injection du service pour la logique métier
    private readonly menuCategoryService: MenuCategoryService,
  ) {}

  /**
   * POST /food/restaurants/:id/menu-categories
   * Crée une nouvelle catégorie de menu pour un restaurant
   */
  @Post(':id/menu-categories')
  @ApiOperation({
    summary: 'Créer une catégorie de menu pour un restaurant',
    description:
      'Crée une catégorie avec nom multilingue (FR/EN/AR/ES), description et ordre pour un restaurant donné.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du restaurant',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: HttpStatus.CREATED, // 201
    description: 'Catégorie créée avec succès',
    type: MenuCategory,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST, // 400
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND, // 404
    description: 'Restaurant introuvable',
  })
  create(
    // ParseUUIDPipe : valide automatiquement que :id est un UUID valide
    // Si ce n'est pas un UUID → erreur 400 automatique avant d'entrer dans le service
    @Param('id', ParseUUIDPipe) restaurantId: string,
    @Body() createMenuCategoryDto: CreateMenuCategoryDto,
  ): MenuCategory {
    return this.menuCategoryService.create(restaurantId, createMenuCategoryDto);
  }
}
