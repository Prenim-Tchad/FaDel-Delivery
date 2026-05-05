/**
 * Types de véhicules disponibles pour la livraison au Tchad
 */
export enum VehicleType {
  MOTO_STANDARD = 'MOTO_STANDARD', // Coursier classique
  CARGO = 'CARGO',                 // Livraison de colis volumineux
  EXPRESS = 'EXPRESS',             // Priorité maximale
}

/**
 * Grille tarifaire par kilomètre (en FCFA)
 */
export const VEHICLE_RATES: Record<VehicleType, number> = {
  [VehicleType.MOTO_STANDARD]: 150,
  [VehicleType.CARGO]: 250,
  [VehicleType.EXPRESS]: 400,
};

/**
 * Paramètres métier pour le marché de N'Djaména
 */
export const PRICING_CONFIG = {
  MINIMUM_FARE: 500,     // Prix plancher pour une course (FCFA)
  NIGHT_SURCHARGE: 1.2,  // Majoration de 20% après 21h (optionnel)
};