import { IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { VehicleType } from '../services/delivery-pricing.constants';

export class CoordinateDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class CreateEstimateDto {
  @IsObject()
  @IsNotEmpty()
  origin: CoordinateDto;

  @IsObject()
  @IsNotEmpty()
  destination: CoordinateDto;

  @IsEnum(VehicleType, {
    message: 'Le type de véhicule doit être : MOTO_STANDARD, CARGO ou EXPRESS',
  })
  @IsNotEmpty()
  vehicleType: VehicleType;
}
