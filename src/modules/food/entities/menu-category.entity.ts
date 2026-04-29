import { ApiProperty } from '@nestjs/swagger';

/**
 * Classe représentant un champ multilingue
 * Amélioration i18n : même structure que MultiLangFieldDto
 * mais utilisée pour les RÉPONSES (output) de l'API
 */
export class MultiLangField {
  @ApiProperty({ example: 'Plats principaux' })
  fr!: string;

  @ApiProperty({ example: 'Main courses' })
  en!: string;

  @ApiProperty({ example: 'الأطباق الرئيسية' })
  ar!: string;

  @ApiProperty({ example: 'Platos principales' })
  es!: string;
}

/**
 * Entité MenuCategory — représente une catégorie de menu d'un restaurant
 *
 * Une Entity sert à :
 * 1. Définir la structure des données retournées par l'API
 * 2. Documenter automatiquement les réponses dans Swagger
 * 3. Servir de type TypeScript dans le service et repository
 */
export class MenuCategory {
  @ApiProperty({
    description: 'Identifiant unique de la catégorie',
    example: 'menucat_1_1640995200000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID du restaurant auquel appartient cette catégorie',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  restaurantId!: string;

  @ApiProperty({
    description: 'Nom de la catégorie en 4 langues',
    type: MultiLangField,
  })
  name!: MultiLangField;

  @ApiProperty({
    description: 'Description de la catégorie en 4 langues (optionnel)',
    type: MultiLangField,
    required: false,
  })
  description?: MultiLangField;

  @ApiProperty({
    description: "Ordre d'affichage de la catégorie",
    example: 1,
  })
  sort_order!: number;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Date de dernière modification',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}