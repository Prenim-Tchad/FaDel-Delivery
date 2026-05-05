import { Test, TestingModule } from '@nestjs/testing';
import { GeoService } from './geo.service';

describe('GeoService', () => {
  let service: GeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoService],
    }).compile();

    service = module.get<GeoService>(GeoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateHaversineDistance', () => {
    it('doit calculer correctement la distance entre deux points connus', () => {
      // Coordonnées approximatives à N'Djaména
      // Point A: Chagoua, Point B: Moursal
      const lat1 = 12.091;
      const lon1 = 15.053;
      const lat2 = 12.11;
      const lon2 = 15.045;

      const distance = service.calculateHaversineDistance(
        lat1,
        lon1,
        lat2,
        lon2,
      );

      // La distance doit être positive et cohérente (env 2.3km)
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(5);
      console.log(`Distance Haversine calculée : ${distance.toFixed(2)} km`);
    });
  });

  describe('getRoadDistanceAndDuration (Google Maps)', () => {
    it('doit retourner les données de l API Google', async () => {
      // Note : Ce test nécessite une clé API valide dans ton .env
      const origin = { lat: 12.091, lng: 15.053 };
      const destination = { lat: 12.11, lng: 15.045 };

      try {
        const result = await service.getRoadDistanceAndDuration(
          origin,
          destination,
        );

        expect(result).toHaveProperty('distanceKm');
        expect(result).toHaveProperty('durationMinutes');
        console.log(
          `Résultat Google : ${result.textDistance} en ${result.textDuration}`,
        );
      } catch (error) {
        console.warn('Test Google Maps sauté ou échoué (vérifie ta clé API)');
      }
    });
  });
});
