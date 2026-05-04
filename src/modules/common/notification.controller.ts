import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FcmService } from './fcm.service';
import { NotificationService } from './notification.service';

// Interface pour structurer les données de l'alerte hybride
interface HybridAlertDto {
  phone: string;
  fcmToken: string;
  message: string;
  orderId: string;
  amount: number;
  neighborhood: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  // Initialisation du Logger pour régler l'erreur de résolution de type
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly fcmService: FcmService,
    private readonly twilioService: NotificationService,
  ) {}

  /**
   * Envoyer une notification Push à un utilisateur spécifique (via Token)
   */
  @ApiOperation({ summary: 'Envoyer un push ciblé via token FCM' })
  @Post('push/single')
  async sendPushToUser(
    @Body() data: { token: string; title: string; body: string },
  ) {
    if (!data.token) {
      throw new BadRequestException(
        "Le token FCM est requis pour identifier l'appareil.",
      );
    }

    return await this.fcmService.sendToDevice(
      data.token,
      data.title,
      data.body,
    );
  }

  /**
   * Envoyer une notification Push par thématique (ex: 'all_drivers')
   */
  @ApiOperation({
    summary: 'Envoyer une notification à tout un groupe (Topic)',
  })
  @Post('push/topic')
  async sendPushToTopic(
    @Body() data: { topic: string; title: string; body: string },
  ) {
    if (!data.topic) {
      throw new BadRequestException('Le nom du topic est requis.');
    }

    return await this.fcmService.sendToTopic(data.topic, data.title, data.body);
  }

  /**
   * Alerte Hybride : Envoie un Push + Un WhatsApp
   */
  @ApiOperation({ summary: 'Double notification : Push FCM + WhatsApp Twilio' })
  @Post('alert/hybrid')
  async sendHybridAlert(@Body() data: HybridAlertDto) {
    if (!data.fcmToken || !data.phone) {
      throw new BadRequestException(
        'Le token FCM et le numéro de téléphone sont obligatoires.',
      );
    }

    try {
      // 1. Envoi du Push
      const pushResult = await this.fcmService.sendToDevice(
        data.fcmToken,
        'Alerte FaDel Delivery',
        data.message,
      );

      // 2. Envoi du WhatsApp (Retrait du .toString() pour correspondre au type number)
      const whatsappResult = await this.twilioService.sendOrderConfirmation(
        data.phone,
        data.orderId,
        data.amount,
        data.neighborhood,
      );

      return {
        success: true,
        status: {
          push: pushResult ? 'success' : 'failed',
          whatsapp: whatsappResult ? 'success' : 'failed',
        },
        message: 'Processus de notification hybride terminé.',
      };
    } catch (error: unknown) {
      // Gestion sécurisée de l'erreur pour le Linter
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Erreur notification: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}
