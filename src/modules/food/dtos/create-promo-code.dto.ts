import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, IsBoolean, IsArray, IsEnum, IsDateString, ArrayNotEmpty } from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export class CreatePromoCodeDto {
  @ApiProperty({ description: 'Code promo unique', example: 'WELCOME10' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nom du code promo', example: 'Remise de bienvenue' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description du code promo', example: '10% de réduction sur la première commande', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Type de réduction', enum: DiscountType, example: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ description: 'Montant de réduction', example: 10 })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty({ description: 'Commande minimum requise pour appliquer le code', example: 2000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumOrder?: number;

  @ApiProperty({ description: 'Réduction maximale pour un code pourcentage', example: 1500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maximumDiscount?: number;

  @ApiProperty({ description: 'Code actif', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Nombre maximum d’utilisations', example: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageLimit?: number;

  @ApiProperty({ description: 'Nombre maximum d’utilisations par utilisateur', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  perUserLimit?: number;

  @ApiProperty({ description: 'Date de début de validité', example: '2026-05-01T00:00:00Z' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ description: 'Date de fin de validité', example: '2026-06-01T00:00:00Z' })
  @IsDateString()
  validUntil: string;

  @ApiProperty({ description: 'Liste des restaurants applicables', example: ['rest1', 'rest2'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  applicableRestaurants?: string[];

  @ApiProperty({ description: 'Liste des catégories applicables', example: ['cat1', 'cat2'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  applicableCategories?: string[];
}
