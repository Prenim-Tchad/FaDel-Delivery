import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DeliveryService } from './delivery.service';
import { DeliveryPricingService } from './delivery-pricing.service'; // 🆕 Import du nouveau service

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [],
  providers: [
    DeliveryService,
    DeliveryPricingService, // 🆕 Ajouté ici
  ],
  exports: [
    DeliveryService,
    DeliveryPricingService, // 🆕 Exporté pour que le module 'Orders' puisse calculer le montant total
  ],
})
export class DeliveryModule {}
