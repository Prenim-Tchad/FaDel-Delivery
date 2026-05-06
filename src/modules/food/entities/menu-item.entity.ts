import { ApiProperty } from '@nestjs/swagger';

/**
 * Entité MenuItem — représente un article dans une catégorie de menu
 *
 * Un article (item) appartient à une catégorie de menu (MenuCategory)
 * qui appartient elle-même à un restaurant
 *
 * Relation : Restaurant → MenuCategory → MenuItem
 */
export class MenuItem {
  @ApiProperty({ example: 'menuitem_1_1640995200000' })
  id!: string;

  @ApiProperty({
    description: 'ID de la catégorie de menu à laquelle appartient cet article',
    example: 'menucat_1_1640995200000',
  })
  menuCategoryId!: string;

  @ApiProperty({
    description: "Nom de l'article",
    example: 'Poulet Yassa',
  })
  name!: string;

  @ApiProperty({
    description: "Description de l'article",
    example: 'Poulet mariné, oignons et citron',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Prix en FCFA',
    example: 3500,
  })
  price!: number;

  @ApiProperty({
    description: "URL de l'image",
    example: 'https://example.com/menu/poulet-yassa.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Disponible à la vente',
    example: true,
    default: true,
  })
  isAvailable!: boolean;

  @ApiProperty({
  description: "État de disponibilité de l'article",
  enum: ['AVAILABLE', 'HIDDEN', 'OUT_OF_STOCK'],
  example: 'AVAILABLE',
  default: 'AVAILABLE',
})
availabilityStatus!: string; // 🆕 tâche #38

  @ApiProperty({
    description: 'Article populaire (mis en avant)',
    example: false,
    default: false,
  })
  isPopular!: boolean; // 🆕 champ ajouté par Saleh

  @ApiProperty({ description: 'Végétarien', example: false, default: false })
  isVegetarian!: boolean;

  @ApiProperty({ description: 'Végétalien', example: false, default: false })
  isVegan!: boolean;

  @ApiProperty({ description: 'Sans gluten', example: false, default: false })
  isGlutenFree!: boolean;

  @ApiProperty({ description: 'Halal', example: false, default: false })
  isHalal!: boolean;

  @ApiProperty({ description: 'Casher', example: false, default: false })
  isKosher!: boolean;

  @ApiProperty({
    description: 'Temps de préparation en minutes',
    example: 20,
    required: false,
  })
  preparationTime?: number;

  @ApiProperty({
    description: 'Calories',
    example: 520,
    required: false,
  })
  calories?: number;

  @ApiProperty({
    description: 'Allergènes',
    example: ['arachides', 'gluten'],
    type: [String],
    required: false,
  })
  allergens?: string[];

  @ApiProperty({
    description: 'Ingrédients',
    example: ['poulet', 'oignons', 'citron'],
    type: [String],
    required: false,
  })
  ingredients?: string[];

  @ApiProperty({
    description: 'Ordre de tri dans la catégorie',
    example: 10,
    required: false,
  })
  sortOrder?: number;

  @ApiProperty({
    description: "Indique si l'article est supprimé (soft-delete)",
    example: false,
    default: false,
  })
  isDeleted!: boolean;

  @ApiProperty({
    description: 'Date de suppression (null si pas supprimé)',
    required: false,
  })
  deletedAt?: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
