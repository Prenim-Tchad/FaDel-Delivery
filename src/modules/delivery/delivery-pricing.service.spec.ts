import { Test, TestingModule } from '@nestjs/testing';
import {
  DeliveryPricingService,
  VehicleType,
} from './delivery-pricing.service';
import { DeliveryService } from './delivery.service';

describe('DeliveryPricingService', () => {
  let pricingService: DeliveryPricingService;
  let geoService: DeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPricingService,
        {
          provide: DeliveryService,
          useValue: {
            // On simule une distance fixe de 10km pour tester les tarifs facilement
            calculateDistance: jest.fn().mockReturnValue(10),
            getTravelEstimation: jest.fn().mockResolvedValue({
              distance: '10 km',
              duration: '15 min',
              method: 'Haversine',
            }),
          },
        },
      ],
    }).compile();

    pricingService = module.get<DeliveryPricingService>(DeliveryPricingService);
    geoService = module.get<DeliveryService>(DeliveryService);
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
    // On change la simulation pour une distance très courte (1km)
    jest.spyOn(geoService, 'calculateDistance').mockReturnValue(1);
    jest.spyOn(geoService, 'getTravelEstimation').mockResolvedValue({
      distance: '1 km',
      duration: '2 min',
      method: 'Haversine',
    });

    const result = await pricingService.calculatePrice(
      0,
      0,
      0,
      0,
      VehicleType.MOTO,
    );
    // 1km * 150 = 150, mais le minimum est 500
    expect(result.totalPrice).toBe(500);
  });
});
