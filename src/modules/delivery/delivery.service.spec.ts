import { DeliveryService } from './delivery.service';
import { BadRequestException } from '@nestjs/common';

describe('DeliveryService', () => {
  let service: DeliveryService;

  beforeEach(() => {
    // Comme ton service utilise HttpService, on lui passe un objet vide {} 
    // ou "null" pour ce test unitaire simple
    service = new DeliveryService(null as any); 
  });

  it('devrait calculer correctement la distance entre Chagoua et l Aéroport', () => {
    // Vérifie bien que le nom ici est le même que dans ton .service.ts
    const dist = service.calculateDistance(12.1022, 15.0681, 12.1325, 15.0333);
    
    expect(dist).toBeGreaterThan(4);
    expect(dist).toBeLessThan(6);
  });

  it('devrait lever une erreur pour des coordonnées invalides', () => {
    expect(() => service.calculateDistance(100, 200, 12.1, 15.1)).toThrow(BadRequestException);
  });
});