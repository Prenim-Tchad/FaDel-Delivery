import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RatingDto {
  @ApiProperty({
    description: 'ID de la commande évaluée',
    example: 'order_123',
  })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'ID du restaurant évalué', example: 'rest_123' })
  @IsString()
  restaurantId: string;

  @ApiProperty({ description: 'Note de 1 à 5', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Commentaire de l’utilisateur',
    example: 'Service excellent et plats savoureux',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
