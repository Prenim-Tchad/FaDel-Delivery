import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryPricingService } from './delivery-pricing.service';
import { GeoService } from './geo.service'; // 🆕 Import du service de géolocalisation

@Module({
  imports: [
    HttpModule, 
    ConfigModule
  ],
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    DeliveryPricingService,
    GeoService, // 🆕 Enregistré pour le calcul Haversine/OSRM
  ],
  exports: [
    DeliveryService,
    DeliveryPricingService,
    GeoService, // 🆕 Exporté pour permettre d'autres calculs de distance dans l'app
  ],
})
export class DeliveryModule {}