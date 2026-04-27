import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsUrl, IsUUID, Min, IsLatitude, IsLongitude, IsArray } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Nom du restaurant', example: 'La Casa du Délice' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description du restaurant', example: 'Cuisine locale et internationale', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Adresse complète du restaurant', example: 'Avenue de la Paix, N'Djaména' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Numéro de téléphone du restaurant', example: '+235 123 456 789' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email du restaurant', example: 'contact@lacasa.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Site web du restaurant', example: 'https://lacasa.example.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ description: 'URL du logo', example: 'https://lacasa.example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({ description: 'URL de l’image de couverture', example: 'https://lacasa.example.com/cover.jpg', required: false })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiProperty({ description: 'Latitude du restaurant', example: 12.1345, required: false })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ description: 'Longitude du restaurant', example: 15.0456, required: false })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ description: 'Ville du restaurant', example: 'N’Djaména' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Pays du restaurant', example: 'Chad', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Frais de livraison en CFA', example: 500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deliveryFee?: number;

  @ApiProperty({ description: 'Montant de commande minimum en CFA', example: 2000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumOrder?: number;

  @ApiProperty({ description: 'Délai estimé de livraison en minutes', example: 35, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedDelivery?: number;

  @ApiProperty({ description: 'Fuseau horaire du restaurant', example: 'Africa/Ndjamena', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ description: 'ID de la catégorie de cuisine', example: 'ckabc123', required: false })
  @IsOptional()
  @IsString()
  cuisineCategoryId?: string;

  @ApiProperty({ description: 'ID du propriétaire du restaurant', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ description: 'Liste des zones de livraison', example: [{ name: 'Centre-ville', deliveryFee: 300 }], required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  deliveryZones?: Array<{ name: string; deliveryFee: number }>;
}
