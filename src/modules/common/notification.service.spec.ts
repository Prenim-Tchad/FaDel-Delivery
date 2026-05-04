import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let service: NotificationService;

  interface TwilioMessageParams {
    to: string;
    from: string;
    body: string;
  }

  interface TwilioResponse {
    sid: string;
  }

  // Mock strictement typé — zéro any
  const mockCreate = jest.fn<Promise<TwilioResponse>, [TwilioMessageParams]>()
    .mockResolvedValue({ sid: 'SM12345' });

  const mockTwilioClient = {
    messages: { create: mockCreate },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string): string | null => {
              const config: Record<string, string> = {
                 TWILIO_ACCOUNT_SID:     'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                 TWILIO_AUTH_TOKEN:      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                TWILIO_WHATSAPP_NUMBER: '+14155238886',
                };
             
 
              return config[key] ?? null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);

    // Cast sécurisé sans any
    (service as unknown as { client: typeof mockTwilioClient }).client = mockTwilioClient;
  });

  afterEach(() => {
    mockCreate.mockClear();
  });

  it('devrait formater correctement le message de confirmation de commande', async () => {
    const phone        = '+23568383778';
    const orderId      = '1001';
    const amount       = 1500;
    const neighborhood = 'Chagoua';

    await service.sendOrderConfirmation(phone, orderId, amount, neighborhood);

    // ✅ mock.calls est typé [TwilioMessageParams][] — aucun any
    const calls = mockCreate.mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    const lastCall: TwilioMessageParams = calls[calls.length - 1][0];
    expect(lastCall.to).toBe(`whatsapp:${phone}`);
    expect(lastCall.body).toMatch(
      new RegExp(`#${orderId}.*${amount} FCFA.*${neighborhood}`),
    );
  });

  it('devrait envoyer une alerte correcte au livreur', async () => {
    const phone    = '+23599001122';
    const distance = '2.5 km';
    const price    = 500;
    const pickup   = 'Boutique Total';

    await service.sendDriverAlert(phone, distance, price, pickup);

    const calls = mockCreate.mock.calls;
    expect(calls.length).toBeGreaterThan(0);

    const lastCall: TwilioMessageParams = calls[calls.length - 1][0];
    expect(lastCall.to).toBe(`whatsapp:${phone}`);
    expect(lastCall.body).toContain(distance);
  });
});