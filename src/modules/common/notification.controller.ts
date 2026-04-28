import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly fcmService: FcmService,
    private readonly twilioService: NotificationService,
  ) {}

  /**
   * Envoyer une notification Push à un utilisateur spécifique (via Token)
   */
  @Post('push/single')
  async sendPushToUser(@Body() data: { token: string; title: string; body: string }) {
    if (!data.token) throw new BadRequestException('Le token FCM est requis');
    return await this.fcmService.sendToDevice(data.token, data.title, data.body);
  }

  /**
   * Envoyer une notification Push par thématique (ex: 'all_drivers')
   */
  @Post('push/topic')
  async sendPushToTopic(@Body() data: { topic: string; title: string; body: string }) {
    return await this.fcmService.sendToTopic(data.topic, data.title, data.body);
  }

  /**
   * Alerte Hybride : Envoie un Push + Un WhatsApp (Sécurité maximale pour FaDel)
   */
  @Post('alert/hybrid')
  async sendHybridAlert(@Body() data: { phone: string; fcmToken: string; message: string }) {
    // 1. Envoi du Push
    const pushResult = await this.fcmService.sendToDevice(data.fcmToken, 'Alerte FaDel', data.message);
    
    // 2. Envoi du WhatsApp (via le service Twilio que tu as déjà validé)
    const whatsappResult = await this.twilioService.sendOrderConfirmation(data.phone, 'URGENT', 0, 'Livraison');

    return {
      push: 'Envoyé',
      whatsapp: 'Envoyé',
      results: { pushResult, whatsappResult }
    };
  }
}