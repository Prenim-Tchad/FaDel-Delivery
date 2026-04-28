import { Injectable, Logger } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

// Définition des types de véhicules pour éviter les erreurs de frappe
export enum VehicleType {
  MOTO = 'MOTO',       // Standard : 150 FCFA/km
  CARGO = 'CARGO',     // Gros colis : 250 FCFA/km
  EXPRESS = 'EXPRESS'  // Prioritaire : 400 FCFA/km
}

@Injectable()
export class DeliveryPricingService {
  private readonly logger = new Logger(DeliveryPricingService.name);

  // Configuration des tarifs par kilomètre (FCFA)
  private readonly RATES = {
    [VehicleType.MOTO]: 150,
    [VehicleType.CARGO]: 250,
    [VehicleType.EXPRESS]: 400,
  };

  // Frais de base minimum (ex: une course de 500m ne peut pas coûter 75 FCFA)
  private readonly MINIMUM_FARE = 500;

  constructor(private readonly geoService: DeliveryService) {}

  /**
   * Calcule le prix total de la livraison
   */
  async calculatePrice(lat1: number, lon1: number, lat2: number, lon2: number, vehicle: VehicleType) {
    // 1. Récupération de la distance (via ton module #22)
    const estimation = await this.geoService.getTravelEstimation(lat1, lon1, lat2, lon2);
    const distanceKm = parseFloat(estimation.distance);

    // 2. Sélection du tarif correspondant au véhicule
    const ratePerKm = this.RATES[vehicle] || this.RATES.MOTO;

    // 3. Calcul du prix brut
    let totalPrice = distanceKm * ratePerKm;

    // 4. Application du tarif minimum si nécessaire
    if (totalPrice < this.MINIMUM_FARE) {
      totalPrice = this.MINIMUM_FARE;
    }

    // Arrondi au multiple de 25 le plus proche (courant pour la monnaie au Tchad)
    const roundedPrice = Math.ceil(totalPrice / 25) * 25;

    this.logger.log(`Calcul prix : ${distanceKm}km avec ${vehicle} = ${roundedPrice} FCFA`);

    return {
      distance: estimation.distance,
      duration: estimation.duration,
      vehicle: vehicle,
      unitRate: ratePerKm,
      totalPrice: roundedPrice,
      currency: 'FCFA',
      method: estimation.method // Précise si c'est Haversine ou Google Maps
    };
  }
}