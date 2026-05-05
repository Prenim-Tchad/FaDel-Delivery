import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client, TravelMode } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GeoService {
  private googleMapsClient: Client;
  private readonly EARTH_RADIUS = 6371;

  constructor() {
    this.googleMapsClient = new Client({});
  }

  /**
   * Calcul Haversine (A vol d'oiseau)
   * Utile pour un premier filtrage rapide des livreurs proches
   */
  calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS * c;
  }

  /**
   * Estimation réelle via Google Maps Distance Matrix
   * Donne la distance par la route et le temps de trajet
   */
  async getRoadDistanceAndDuration(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    try {
      const response = await this.googleMapsClient.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          mode: TravelMode.driving, // ou TravelMode.bicycling pour les motos
          key: 'TON_API_KEY_GOOGLE_MAPS', 
        },
      });

      const data = response.data.rows[0].elements[0];
      
      if (data.status !== 'OK') {
        throw new Error('Impossible de calculer l’itinéraire');
      }

      return {
        distanceKm: data.distance.value / 1000,
        durationMinutes: Math.ceil(data.duration.value / 60),
        textDistance: data.distance.text,
        textDuration: data.duration.text,
      };
    } catch (error) {
      throw new InternalServerErrorException('Erreur Google Maps API: ' + error.message);
    }
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}