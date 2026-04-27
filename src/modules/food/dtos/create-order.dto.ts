import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber, Min, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryMode } from '../../../shared/enums';

class CreateOrderItemDto {
  @ApiProperty({ description: 'ID de l’article de menu', example: 'ckabc123' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'Quantité commandée', example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Instructions spéciales', example: 'Sans piment', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({ description: 'IDs des options de modificateur sélectionnées', example: ['opt1', 'opt2'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modifierOptionIds?: string[];
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID du client', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'ID du restaurant', example: 'ckabc123' })
  @IsString()
  restaurantId: string;

  @ApiProperty({ description: 'Mode de livraison', enum: DeliveryMode, example: DeliveryMode.DELIVERY })
  @IsEnum(DeliveryMode)
  orderType: DeliveryMode;

  @ApiProperty({ description: 'Adresse de livraison', example: 'Quartier 5, Rue Principale', required: false })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiProperty({ description: 'Latitude de livraison', example: 12.1345, required: false })
  @IsOptional()
  @IsNumber()
  deliveryLatitude?: number;

  @ApiProperty({ description: 'Longitude de livraison', example: 15.0456, required: false })
  @IsOptional()
  @IsNumber()
  deliveryLongitude?: number;

  @ApiProperty({ description: 'Notes de livraison', example: 'Sonner deux fois', required: false })
  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @ApiProperty({ description: 'Téléphone du client', example: '+235 123 456 789' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'Nom du client', example: 'Moussa Abakar' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Liste des articles commandés', type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
