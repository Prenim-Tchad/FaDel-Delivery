import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DeliveryPricingService } from '../services/delivery-pricing.service';
import { CreateEstimateDto } from '../dtos/create-estimate.dto';

@Controller('pricing')
export class DeliveryPricingController {
  constructor(private readonly pricingService: DeliveryPricingService) {}

  /**
   * Endpoint pour obtenir une estimation de prix
   * Accessible via POST /pricing/estimate
   */
  @Post('estimate')
  @HttpCode(HttpStatus.OK)
  getEstimate(@Body() dto: CreateEstimateDto): any {
    // 1. Extraction des données
    const origin = {
      lat: dto.origin.lat,
      lng: dto.origin.lng,
    };

    const destination = {
      lat: dto.destination.lat,
      lng: dto.destination.lng,
    };

    const vehicleType = dto.vehicleType;

    // 2. CORRECTION : Suppression du 'await' et du 'async' de la méthode
    // car estimateDeliveryCost est désormais synchrone (calcul immédiat)
    return this.pricingService.estimateDeliveryCost(
      origin,
      destination,
      vehicleType,
    );
  }
}
