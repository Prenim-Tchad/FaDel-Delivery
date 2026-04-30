import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'ID de la catégorie de menu',
    example: 'cuid123',
  })
  @IsUUID()
  menuCategoryId!: string;

  @ApiProperty({
    description: 'Nom de l’article du menu',
    example: 'Poulet Yassa',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Description de l’article',
    example: 'Poulet mariné, oignons et citron',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Prix en CFA', example: 3500 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'URL de l’image',
    example: 'https://example.com/menu/poulet-yassa.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Disponible à la vente',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Indique si végétarien',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVegetarian?: boolean;

  @ApiProperty({
    description: 'Indique si végétalien',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVegan?: boolean;

  @ApiProperty({ description: 'Sans gluten', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isGlutenFree?: boolean;

  @ApiProperty({ description: 'Halal', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isHalal?: boolean;

  @ApiProperty({ description: 'Casher', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isKosher?: boolean;

  @ApiProperty({
    description: 'Temps de préparation en minutes',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preparationTime?: number;

  @ApiProperty({ description: 'Calories', example: 520, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiProperty({
    description: 'Allergènes',
    example: ['arachides', 'gluten'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

  @ApiProperty({
    description: 'Ingrédients',
    example: ['poulet', 'oignons', 'citron'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({
  description: 'Indique si l\'article est populaire',
  example: false,
  default: false,
  required: false,
})
@IsOptional()
@IsBoolean()
isPopular?: boolean;

  @ApiProperty({
    description: 'Ordre de tri dans le menu',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
