import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RedisService } from '../redis/redis.service';

// L'interface doit être définie ICI, avant la classe
interface DriverMatch {
  driverId: string;
  distance: string;
  coords: { lat: number; lng: number };
}

@ApiTags('Livreurs (Real-time)') // Vérifie qu'il n'y a rien entre les imports et cette ligne
@Controller('driver')
export class DriverController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Mise à jour de la position GPS du livreur (TTL 30s)
   */
  @ApiOperation({ summary: 'Mettre à jour la position GPS (Cache Redis 30s)' })
  @Post('location')
  async updateLocation(
    @Body() data: { driverId: string; lat: number; lng: number },
  ) {
    if (!data.driverId || data.lat === undefined || data.lng === undefined) {
      throw new BadRequestException('Données GPS incomplètes');
    }

    await this.redisService.setJson(
      `driver_loc:${data.driverId}`,
      {
        lat: data.lat,
        lng: data.lng,
        updatedAt: new Date().toISOString(),
      },
      30,
    );

    return { success: true, message: 'Position enregistrée' };
  }

  /**
   * Récupérer la position d'un livreur spécifique
   */
  @ApiOperation({ summary: "Récupérer la position actuelle d'un livreur" })
  @Get('location/:driverId')
  async getLocation(@Param('driverId') driverId: string) {
    const location = await this.redisService.getJson<{
      lat: number;
      lng: number;
    }>(`driver_loc:${driverId}`);

    if (!location) {
      return {
        active: false,
        message: 'Livreur hors ligne ou position expirée',
      };
    }

    return { active: true, location };
  }

  /**
   * Trouver les livreurs proches d'un point (Restaurant)
   * Utile pour l'attribution automatique des commandes
   */
  @ApiOperation({ summary: "Trouver les livreurs à proximité d'un restaurant" })
  @Post('find-nearby')
  async findNearbyDrivers(
    @Body() data: { lat: number; lng: number; radiusKm?: number },
  ) {
    const radius = data.radiusKm ?? 5; // Rayon par défaut de 5km
    const keys = await this.redisService.keys('driver_loc:*');

    const nearbyDrivers: DriverMatch[] = [];

    for (const key of keys) {
      const driverData = await this.redisService.getJson<{
        lat: number;
        lng: number;
      }>(key);

      if (driverData) {
        const distance = this.calculateDistance(
          data.lat,
          data.lng,
          driverData.lat,
          driverData.lng,
        );

        if (distance <= radius) {
          nearbyDrivers.push({
            driverId: key.split(':')[1],
            distance: `${distance.toFixed(2)} km`,
            coords: driverData,
          });
        }
      }
    }

    // Tri par proximité (le plus proche en premier)
    return nearbyDrivers.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance),
    );
  }

  /**
   * Formule de Haversine pour le calcul de distance GPS
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
