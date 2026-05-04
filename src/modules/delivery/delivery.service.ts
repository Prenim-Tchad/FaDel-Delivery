import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../redis/redis.service';

// 1. Définition des interfaces pour typer la réponse Google Maps
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
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Enregistre la position du livreur dans le cache Redis (TTL 30s)
   */
  async trackDriver(driverId: string, lat: number, lng: number): Promise<void> {
    try {
      await this.redisService.setJson(
        `driver_loc:${driverId}`,
        { lat, lng },
        30,
      );
    } catch (error) {
      this.logger.error(
        `Erreur tracking Redis: ${error instanceof Error ? error.message : 'Unknown'}`,
      );
    }
  }

  /**
   * Méthode synchrone pour le calcul mathématique simple (Haversine)
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
   * Méthode asynchrone complète avec Google Maps pour FaDel
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

        // Typage explicite de la réponse HTTP
        const response = await firstValueFrom(
          this.httpService.get<GoogleMapsResponse>(url),
        );

        const firstRow = response.data.rows[0];
        const firstElement = firstRow?.elements[0];

        if (firstElement?.status === 'OK') {
          duration = firstElement.duration.text;
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Google Maps API Error: ${msg}`);
      }
    }

    return {
      distance: `${distanceHaversine} km`,
      duration: duration || 'Estimation indisponible',
      method: duration ? 'Google Maps' : 'Haversine',
    };
  }

  /**
   * Logique interne Haversine
   */
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

  /**
   * Validation des coordonnées GPS
   */
  private isValid(lat: number, lon: number): boolean {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }
}
