import {
  Client,
  DistanceMatrixRowElement,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class GeoService {
  private googleMapsClient: Client;
  private readonly EARTH_RADIUS = 6371;

  constructor() {
    this.googleMapsClient = new Client({});
  }

  /**
   * Calcul Haversine (A vol d'oiseau)
   * Synchrone : aucune Promise ici.
   */
  calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS * c;
  }

  /**
   * Estimation réelle via Google Maps Distance Matrix
   */
  async getRoadDistanceAndDuration(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    try {
      const response = await this.googleMapsClient.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          mode: TravelMode.driving,
          key: process.env.GOOGLE_MAPS_KEY || '',
        },
      });

      // Typage explicite de l'élément pour rassurer ESLint
      const row = response.data.rows[0];
      const data: DistanceMatrixRowElement | undefined = row?.elements[0];

      if (!data || (data.status as string) !== 'OK') {
        throw new Error(
          `Google API Status: ${data?.status || 'No data found'}`,
        );
      }

      // On vérifie que distance et duration existent avant d'accéder à .value
      if (!data.distance || !data.duration) {
        throw new Error(
          'Données de distance ou durée manquantes dans la réponse Google',
        );
      }

      return {
        distanceKm: data.distance.value / 1000,
        durationMinutes: Math.ceil(data.duration.value / 60),
        textDistance: data.distance.text,
        textDuration: data.duration.text,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Erreur Google Maps API: ' + message,
      );
    }
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
