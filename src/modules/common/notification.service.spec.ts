import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let service: NotificationService;

  // 1. Définition du mock avec un typage partiel pour éviter 'any'
  const mockTwilioClient = {
    messages: {
      create: jest.fn().mockResolvedValue({ sid: 'SM12345' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: ConfigService,
          useValue: {
            // Typage explicite du retour pour éviter 'no-unsafe-return'
            get: jest.fn((key: string): string | null => {
              const config: Record<string, string> = {
                TWILIO_ACCOUNT_SID: 'AC913...',
                TWILIO_AUTH_TOKEN: '9bf3b...',
                TWILIO_WHATSAPP_NUMBER: '+14155238886',
              };
              return config[key] || null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);

    // 2. Injection sécurisée du mock Twilio (Ligne 56 / 74)
    // On utilise un type d'interface temporaire pour l'accès à la propriété privée 'client'
    // Cela neutralise définitivement 'Unsafe assignment of an any value'
    (service as unknown as { client: unknown }).client = mockTwilioClient;
  });

  it('devrait formater correctement le message de confirmation de commande', async () => {
    const phone = '+23568383778';
    const orderId = '1001';
    const amount = 1500;
    const neighborhood = 'Chagoua';

    await service.sendOrderConfirmation(phone, orderId, amount, neighborhood);

    // 3. Vérification robuste avec RegExp
    // Valide la présence de l'ID, du prix en FCFA et du quartier (Chagoua)
    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        to: `whatsapp:${phone}`,
        body: expect.stringMatching(
          new RegExp(`#${orderId}.*${amount} FCFA.*${neighborhood}`),
        ),
      }),
    );
  });

  it('devrait envoyer une alerte correcte au livreur', async () => {
    const phone = '+23599001122';
    const distance = '2.5 km';
    const price = 500;
    const pickup = 'Boutique Total';

    await service.sendDriverAlert(phone, distance, price, pickup);

    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        to: `whatsapp:${phone}`,
        body: expect.stringContaining(distance),
      }),
    );
  });
});
