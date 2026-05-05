import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryZoneItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNumber()
  @Min(0.1)
  radius: number; // Rayon en km

  @IsNumber()
  @Min(0)
  deliveryFee: number;
}

export class CreateDeliveryZonesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryZoneItemDto)
  zones: DeliveryZoneItemDto[];
}
