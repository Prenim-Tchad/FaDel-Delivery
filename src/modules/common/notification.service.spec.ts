import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let service: NotificationService;

  // On crée un "Mock" de Twilio pour ne pas envoyer de vrais SMS pendant le test
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
            get: jest.fn((key: string) => {
              if (key === 'TWILIO_ACCOUNT_SID') return 'AC913...';
              if (key === 'TWILIO_AUTH_TOKEN') return '9bf3b...';
              if (key === 'TWILIO_WHATSAPP_NUMBER') return '+14155238886';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    // On force l'injection du mock Twilio dans le service
    (service as any).client = mockTwilioClient;
  });

  it('devrait formater correctement le message de confirmation de commande', async () => {
    const phone = '+23568383778';
    await service.sendOrderConfirmation(phone, '1001', 1500, 'Chagoua');

    // On vérifie que le message contient bien les informations clés
    expect(mockTwilioClient.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        to: `whatsapp:${phone}`,
        body: expect.stringContaining('#1001'),
        body: expect.stringContaining('1500 FCFA'),
        body: expect.stringContaining('Chagoua'),
      }),
    );
  });
});
