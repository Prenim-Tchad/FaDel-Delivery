import { DeliveryPricingService } from './delivery-pricing.service';

describe('DeliveryPricingService', () => {
  let service: DeliveryPricingService;

  beforeEach(() => {
    service = new DeliveryPricingService();
  });

  it('devrait calculer le prix de base pour une Moto (1.0x)', () => {
    const price = service.calculatePrice(5, 1.0); // 5km, multiplier 1.0
    expect(price).toBe(500); // En supposant 100 FCFA / km
  });

  it('devrait appliquer le multiplicateur Voiture (2.0x)', () => {
    const price = service.calculatePrice(5, 2.0); 
    expect(price).toBe(1000);
  });

  it('ne devrait jamais être inférieur au prix minimum (400 FCFA)', () => {
    const price = service.calculatePrice(1, 1.0); 
    expect(price).toBeGreaterThanOrEqual(400);
  });
});