import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Classe réutilisable pour les champs multilingues (FR/EN/AR/ES)
 * Amélioration i18n : standardise la gestion des langues dans tout le projet
 * Peut être déplacée dans src/common/ pour être partagée entre tous les modules
 */
export class MultiLangFieldDto {
  @ApiProperty({ description: 'Texte en Français', example: 'Plats principaux' })
  @IsString()
  fr!: string;

  @ApiProperty({ description: 'Text in English', example: 'Main courses' })
  @IsString()
  en!: string;

  @ApiProperty({ description: 'النص بالعربية', example: 'الأطباق الرئيسية' })
  @IsString()
  ar!: string;

  @ApiProperty({ description: 'Texto en Español', example: 'Platos principales' })
  @IsString()
  es!: string;
}

/**
 * DTO de validation pour la création d'une catégorie de menu
 * Utilisé par : POST /food/restaurants/:id/menu-categories
 *
 * Un DTO (Data Transfer Object) sert à :
 * 1. Valider les données envoyées par le client
 * 2. Documenter automatiquement l'API via Swagger
 * 3. Rejeter les requêtes invalides avant qu'elles atteignent le service
 */
export class CreateMenuCategoryDto {
  @ApiProperty({
    description: 'Nom de la catégorie en 4 langues (FR/EN/AR/ES)',
    example: {
      fr: 'Plats principaux',
      en: 'Main courses',
      ar: 'الأطباق الرئيسية',
      es: 'Platos principales',
    },
  })
  @IsObject()
  @ValidateNested() // Valide chaque champ imbriqué (fr, en, ar, es)
  @Type(() => MultiLangFieldDto) // Nécessaire pour que ValidateNested fonctionne
  name!: MultiLangFieldDto;

  @ApiProperty({
    description: 'Description de la catégorie en 4 langues (optionnel)',
    example: {
      fr: 'Nos meilleurs plats du chef',
      en: 'Our best chef dishes',
      ar: 'أفضل أطباق الشيف',
      es: 'Nuestros mejores platos del chef',
    },
    required: false,
  })
  @IsOptional() // Ce champ n'est pas obligatoire
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLangFieldDto)
  description?: MultiLangFieldDto;

  @ApiProperty({
    description: "Ordre d'affichage de la catégorie (0 = affiché en premier)",
    example: 1,
    minimum: 0,
  })
  @IsNumber()
  @Min(0) // L'ordre ne peut pas être négatif
  sort_order!: number;
}