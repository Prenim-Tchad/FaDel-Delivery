import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsPhoneNumber,
  ValidateNested,
  ArrayNotEmpty,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType, PaymentMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ example: 'clxxx123', description: 'ID du MenuItem' })
  @IsString()
  menuItemId!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 'Sans oignons', required: false })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiProperty({
    example: ['clmod1'],
    required: false,
    description: 'IDs des options modificateurs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modifierOptionIds?: string[];
}

export class CreateOrderDto {
  @ApiProperty({ example: 'clrest123', description: 'ID du restaurant' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayNotEmpty({
    message: 'La commande doit contenir au moins un article.',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @ApiProperty({ enum: OrderType, example: OrderType.DELIVERY })
  @IsEnum(OrderType)
  orderType!: OrderType;

  @ApiProperty({ example: "Rue 40, Moursal, N'Djamena", required: false })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @ApiProperty({ example: 12.1048, required: false })
  @IsOptional()
  @IsLatitude()
  deliveryLatitude?: number;

  @ApiProperty({ example: 15.0445, required: false })
  @IsOptional()
  @IsLongitude()
  deliveryLongitude?: number;

  @ApiProperty({ example: 'Sonner deux fois', required: false })
  @IsOptional()
  @IsString()
  deliveryNotes?: string;

  @ApiProperty({ example: '+23560000000' })
  @IsPhoneNumber('TD')
  customerPhone!: string;

  @ApiProperty({ example: 'Hassane Tomté' })
  @IsString()
  customerName!: string;

  @ApiProperty({ enum: PaymentMethod, required: false })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 'FADEL10', required: false })
  @IsOptional()
  @IsString()
  promoCode?: string;
}
