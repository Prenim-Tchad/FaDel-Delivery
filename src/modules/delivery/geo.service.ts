import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// ✅ Interfaces strictement typées — élimine tous les 'any' OSRM
interface OsrmRoute {
  distance: number;
  duration: number;
}

interface OsrmResponse {
  code: string;
  routes: OsrmRoute[];
}

export interface RoadEstimation {
  distanceKm: number;
  durationMin: number;
  source: 'OSRM' | 'Haversine-Fallback';
}

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Calcul de la distance à vol d'oiseau (Haversine)
   * Utile comme fallback ou pour des calculs rapides.
   */
  getHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Estimation de la distance et durée réelle via OSRM (Gratuit)
   */
  async getRoadEstimation(
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number,
  ): Promise<RoadEstimation> {
    const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false`;

    try {
      // ✅ Typage explicite de la réponse HTTP — neutralise no-unsafe-assignment
      const response = await firstValueFrom(
        this.httpService.get<OsrmResponse>(url, {
          headers: { 'User-Agent': 'FaDel-Delivery-App' },
        }),
      );

      // ✅ response.data est maintenant OsrmResponse — plus de membre unsafe
      const route: OsrmRoute = response.data.routes[0];

      return {
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
        source: 'OSRM',
      };
    } catch (error) {
      this.logger.error('Erreur OSRM, basculement sur Haversine', error);

      const distance = this.getHaversineDistance(
        startLat,
        startLon,
        endLat,
        endLon,
      );

      return {
        distanceKm: distance,
        durationMin: (distance / 30) * 60,
        source: 'Haversine-Fallback',
      };
    }
  }
}
