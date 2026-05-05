import { Injectable, Logger } from '@nestjs/common';
import { GeoService } from './geo.service';
import {
  VehicleType,
  VEHICLE_RATES,
  PRICING_CONFIG,
} from '../services/delivery-pricing.constants';

@Injectable()
export class DeliveryPricingService {
  private readonly logger = new Logger(DeliveryPricingService.name);

  constructor(private readonly geoService: GeoService) {}

  /**
   * Calcule le devis estimatif d'une livraison
   * @param origin Coordonnées de départ (lat, lng)
   * @param destination Coordonnées d'arrivée (lat, lng)
   * @param vehicleType Type de véhicule choisi par l'utilisateur
   * @returns Objet contenant la distance, le prix final et le véhicule
   */
  estimateDeliveryCost(
    // Suppression de "async" car pas de "await" nécessaire
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    vehicleType: VehicleType,
  ) {
    try {
      // 1. Calcul de la distance via le GeoService (Haversine par défaut)
      const distanceKm = this.geoService.calculateHaversineDistance(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng,
      );

      // 2. Récupération du tarif au KM selon le véhicule
      const ratePerKm = VEHICLE_RATES[vehicleType];

      // 3. Calcul du prix brut
      let finalPrice = distanceKm * ratePerKm;

      // 4. Application du tarif minimum (Garantie pour le livreur)
      if (finalPrice < PRICING_CONFIG.MINIMUM_FARE) {
        finalPrice = PRICING_CONFIG.MINIMUM_FARE;
      }

      this.logger.log(
        `Estimation : ${distanceKm.toFixed(2)}km en ${vehicleType} = ${Math.round(finalPrice)} FCFA`,
      );

      return {
        distance: parseFloat(distanceKm.toFixed(2)),
        unitPrice: ratePerKm,
        totalPrice: Math.round(finalPrice),
        currency: 'FCFA',
        vehicle: vehicleType,
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Erreur : ${errorMessage}`);
      throw error;
    }
  }
}
