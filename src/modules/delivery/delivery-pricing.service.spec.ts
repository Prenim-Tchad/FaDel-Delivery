import { Test, TestingModule } from '@nestjs/testing';
import {
  DeliveryPricingService,
  VehicleType,
} from './delivery-pricing.service';
import { GeoService } from './geo.service'; // 🆕 On utilise GeoService maintenant

describe('DeliveryPricingService', () => {
  let pricingService: DeliveryPricingService;
  let geoService: GeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPricingService,
        {
          provide: GeoService, // 🆕 Changement du provider
          useValue: {
            // On simule une réponse de 10km pour nos tests de tarifs
            getRoadEstimation: jest.fn().mockResolvedValue({
              distanceKm: 10,
              durationMin: 15,
              source: 'OSRM',
            }),
            getHaversineDistance: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    pricingService = module.get<DeliveryPricingService>(DeliveryPricingService);
    geoService = module.get<GeoService>(GeoService);
  });

  it('devrait calculer 1500 FCFA pour 10km en MOTO', async () => {
    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.MOTO,
    );
    expect(result.totalPrice).toBe(1500);
  });

  it('devrait calculer 2500 FCFA pour 10km en CARGO', async () => {
    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.CARGO,
    );
    expect(result.totalPrice).toBe(2500);
  });

  it('devrait calculer 4000 FCFA pour 10km en EXPRESS', async () => {
    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.EXPRESS,
    );
    expect(result.totalPrice).toBe(4000);
  });

  it('devrait appliquer le tarif minimum de 500 FCFA', async () => {
    // Simulation d'une distance très courte (1km)
    jest.spyOn(geoService, 'getRoadEstimation').mockResolvedValue({
      distanceKm: 1,
      durationMin: 2,
      source: 'OSRM',
    });

    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.MOTO,
    );
    // 1km * 150 = 150, donc le minimum de 500 s'applique
    expect(result.totalPrice).toBe(500);
  });

  it('devrait arrondir au multiple de 25 supérieur', async () => {
    // 5.1 km * 150 = 765 FCFA. Arrondi à 25 = 775 FCFA
    jest.spyOn(geoService, 'getRoadEstimation').mockResolvedValue({
      distanceKm: 5.1,
      durationMin: 12,
      source: 'OSRM',
    });

    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.MOTO,
    );
    expect(result.totalPrice).toBe(775);
    expect(result.totalPrice % 25).toBe(0);
  });
});
