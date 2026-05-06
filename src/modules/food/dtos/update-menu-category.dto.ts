import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { MultiLangFieldDto } from './create-menu-category.dto';

/**
 * DTO de modification d'une catégorie de menu
 * Utilisé par : PUT /food/menu-categories/:id
 *
 * Tous les champs sont optionnels (PartialType non utilisé ici
 * car on importe MultiLangFieldDto depuis create-menu-category.dto.ts)
 */
export class UpdateMenuCategoryDto {
  @ApiProperty({
    description: 'Nouveau nom de la catégorie en 4 langues (optionnel)',
    example: {
      fr: 'Desserts',
      en: 'Desserts',
      ar: 'الحلويات',
      es: 'Postres',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLangFieldDto)
  name?: MultiLangFieldDto;

  @ApiProperty({
    description: 'Nouvelle description en 4 langues (optionnel)',
    example: {
      fr: 'Nos délicieux desserts',
      en: 'Our delicious desserts',
      ar: 'حلوياتنا اللذيذة',
      es: 'Nuestros deliciosos postres',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MultiLangFieldDto)
  description?: MultiLangFieldDto;

  @ApiProperty({
    description: "Nouvel ordre d'affichage (optionnel)",
    example: 2,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sort_order?: number;
}
