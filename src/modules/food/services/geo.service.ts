import { Injectable, InternalServerErrorException } from '@nestjs/common';

import {
  Client,
  TravelMode,
  DistanceMatrixResponse,
} from '@googlemaps/google-maps-services-js';

interface GoogleDistanceElement {
  status: string;
  distance: { value: number; text: string };
  duration: { value: number; text: string };
}

interface GoogleDistanceResponse {
  rows: Array<{
    elements: Array<GoogleDistanceElement>;
  }>;
}

@Injectable()
export class GeoService {
  // On repasse en 'any' car le linter refuse la construction sur 'unknown'
  private readonly googleMapsClient: any;
  private readonly EARTH_RADIUS = 6371;

  constructor() {
    this.googleMapsClient = new Client({});
  }

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

  async getRoadDistanceAndDuration(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const response = (await this.googleMapsClient.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          mode: TravelMode.driving,
          key: 'TON_API_KEY_GOOGLE_MAPS',
        },
      })) as DistanceMatrixResponse;

      // Double cast pour le linter
      const data = response.data as unknown as GoogleDistanceResponse;
      const element = data.rows[0].elements[0];

      if (element.status !== 'OK') {
        throw new Error('Impossible de calculer l’itinéraire');
      }

      return {
        distanceKm: element.distance.value / 1000,
        durationMinutes: Math.ceil(element.duration.value / 60),
        textDistance: element.distance.text,
        textDuration: element.duration.text,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new InternalServerErrorException(
        'Erreur Google Maps API: ' + errorMessage,
      );
    }
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}
