import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// 1. Définition des interfaces pour typer la réponse Google Maps (évite l'erreur 'any')
interface GoogleMapsElement {
  status: string;
  duration: { text: string };
  distance: { text: string };
}

interface GoogleMapsRow {
  elements: GoogleMapsElement[];
}

interface GoogleMapsResponse {
  rows: GoogleMapsRow[];
}

@Injectable()
export class DeliveryService {
  private readonly EARTH_RADIUS_KM = 6371;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Méthode synchrone pour le calcul mathématique simple
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    if (!this.isValid(lat1, lon1) || !this.isValid(lat2, lon2)) {
      throw new BadRequestException('Coordonnées GPS invalides');
    }
    return this.calculateHaversine(lat1, lon1, lat2, lon2);
  }

  /**
   * Méthode asynchrone complète avec Google Maps
   */
  async getTravelEstimation(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const distanceHaversine = this.calculateDistance(lat1, lon1, lat2, lon2);
    let duration: string | null = null;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&key=${apiKey}`;

        // 2. Typage explicite de la réponse HTTP
        const response = await firstValueFrom(
          this.httpService.get<GoogleMapsResponse>(url),
        );

        // 3. Accès sécurisé aux données typées (règle l'erreur .rows access)
        const firstRow = response.data.rows[0];
        const firstElement = firstRow?.elements[0];

        if (firstElement?.status === 'OK') {
          duration = firstElement.duration.text;
        }
      } catch (error: unknown) {
        // 4. Gestion sécurisée du type error pour le Lint
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Google Maps API Error', msg);
      }
    }

    return {
      distance: `${distanceHaversine} km`,
      duration: duration || 'Estimation indisponible',
      method: duration ? 'Google Maps' : 'Haversine',
    };
  }

  private calculateHaversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((this.EARTH_RADIUS_KM * c).toFixed(2));
  }

  private isValid(lat: number, lon: number): boolean {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }
}
