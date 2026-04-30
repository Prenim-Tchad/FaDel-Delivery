import { Injectable, Logger } from '@nestjs/common';
import { GeoService } from './geo.service'; // 🆕 Import du service de calcul

// Définition des types de véhicules adaptés à FaDel
export enum VehicleType {
  MOTO = 'MOTO',       // Standard : 150 FCFA/km
  CARGO = 'CARGO',     // Gros colis : 250 FCFA/km
  EXPRESS = 'EXPRESS', // Prioritaire : 400 FCFA/km
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

  // Frais de base minimum (ex: 500 FCFA à N'Djaména)
  private readonly MINIMUM_FARE = 500;

  constructor(private readonly geoService: GeoService) {} // 🆕 Injecte GeoService ici

  /**
   * Calcule le prix total de la livraison pour FaDel
   */
  async calculatePrice(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    vehicle: VehicleType = VehicleType.MOTO,
  ) {
    // 1. Récupération de l'estimation réelle (Distance + Durée via OSRM/Haversine)
    const estimation = await this.geoService.getRoadEstimation(
      lat1,
      lon1,
      lat2,
      lon2,
    );

    const distanceKm = estimation.distanceKm;

    // 2. Sélection du tarif correspondant au véhicule
    const ratePerKm = this.RATES[vehicle] || this.RATES.MOTO;

    // 3. Calcul du prix brut
    let totalPrice = distanceKm * ratePerKm;

    // 4. Application du tarif minimum
    if (totalPrice < this.MINIMUM_FARE) {
      totalPrice = this.MINIMUM_FARE;
    }

    // Arrondi au multiple de 25 le plus proche (pratique pour le cash au Tchad)
    const roundedPrice = Math.ceil(totalPrice / 25) * 25;

    this.logger.log(
      `Prix FaDel : ${distanceKm.toFixed(2)}km [${vehicle}] -> ${roundedPrice} FCFA (${estimation.source})`,
    );

    return {
      distance: `${distanceKm.toFixed(2)} km`,
      duration: `${Math.round(estimation.durationMin)} min`,
      vehicle: vehicle,
      unitRate: ratePerKm,
      totalPrice: roundedPrice,
      currency: 'FCFA',
      source: estimation.source, // Indique si c'est OSRM ou Haversine
    };
  }
}