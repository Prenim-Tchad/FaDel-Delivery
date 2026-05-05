import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPricingService } from './delivery-pricing.service';
import { GeoService } from './geo.service';
import { VehicleType } from './delivery-pricing.constants';

describe('DeliveryPricingService', () => {
  let service: DeliveryPricingService;
  let geoService: GeoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPricingService,
        {
          provide: GeoService,
          // On simule (mock) le GeoService pour contrôler la distance retournée
          useValue: { calculateHaversineDistance: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<DeliveryPricingService>(DeliveryPricingService);
    geoService = module.get<GeoService>(GeoService);
  });

  it('devrait calculer 1500 FCFA pour 10km en Moto Standard (10 * 150)', async () => {
    jest.spyOn(geoService, 'calculateHaversineDistance').mockReturnValue(10);
    
    const result = await service.estimateDeliveryCost(
      { lat: 12.1, lng: 15.0 }, { lat: 12.2, lng: 15.1 },
      VehicleType.MOTO_STANDARD
    );

    expect(result.totalPrice).toBe(1500);
  });

  it('devrait appliquer le tarif minimum de 500 FCFA pour une très courte distance', async () => {
    jest.spyOn(geoService, 'calculateHaversineDistance').mockReturnValue(1); // 1km * 150 = 150 FCFA
    
    const result = await service.estimateDeliveryCost(
      { lat: 12.1, lng: 15.0 }, { lat: 12.11, lng: 15.01 },
      VehicleType.MOTO_STANDARD
    );

    expect(result.totalPrice).toBe(500);
  });

  it('devrait calculer 4000 FCFA pour 10km en mode EXPRESS (10 * 400)', async () => {
    jest.spyOn(geoService, 'calculateHaversineDistance').mockReturnValue(10);
    
    const result = await service.estimateDeliveryCost(
      { lat: 0, lng: 0 }, { lat: 0, lng: 0 },
      VehicleType.EXPRESS
    );

    expect(result.totalPrice).toBe(4000);
  });
});