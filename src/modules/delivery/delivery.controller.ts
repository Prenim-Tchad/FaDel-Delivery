import { Controller, Get, Query } from '@nestjs/common';
import {
  DeliveryPricingService,
  VehicleType,
} from './delivery-pricing.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly pricingService: DeliveryPricingService) {}

  @Get('test-price')
  async testPrice(
    @Query('lat1') lat1: string,
    @Query('lon1') lon1: string,
    @Query('lat2') lat2: string,
    @Query('lon2') lon2: string,
    @Query('vehicle') vehicle: VehicleType = VehicleType.MOTO,
  ) {
    return await this.pricingService.calculatePrice(
      parseFloat(lat1),
      parseFloat(lon1),
      parseFloat(lat2),
      parseFloat(lon2),
      vehicle,
    );
  }
}
