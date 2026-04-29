import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationService {
  private client: Twilio;
  private readonly logger = new Logger(NotificationService.name);

  constructor(private config: ConfigService) {
    this.client = new Twilio(
      this.config.get('TWILIO_ACCOUNT_SID'),
      this.config.get('TWILIO_AUTH_TOKEN'),
    );
  }

  /**
   * Envoie une alerte de commande au client
   */
  async sendOrderConfirmation(
    to: string,
    orderId: string,
    amount: number,
    neighborhood: string,
  ) {
    const message = `🍟 *FaDel Express*\n\nBonjour ! Votre commande #${orderId} de ${amount} FCFA vers ${neighborhood} est confirmée. Un livreur arrive bientôt !`;

    return this.sendMessage(to, message, true); // Envoi par WhatsApp par défaut
  }

  /**
   * Alerte pour le livreur (Module #23 + #25)
   */
  async sendDriverAlert(
    to: string,
    distance: string,
    price: number,
    pickup: string,
  ) {
    const message = `🚲 *Nouvelle Course FaDel*\n\nDistance : ${distance}\nGain : ${price} FCFA\nLieu : ${pickup}\n\nRépondez 'OUI' pour accepter.`;

    return this.sendMessage(to, message, true);
  }

  private async sendMessage(to: string, body: string, useWhatsApp: boolean) {
    const from = useWhatsApp
      ? `whatsapp:${this.config.get('TWILIO_WHATSAPP_NUMBER')}`
      : this.config.get('TWILIO_PHONE_NUMBER');

    const recipient = useWhatsApp ? `whatsapp:${to}` : to;

    try {
      const result = await this.client.messages.create({
        body,
        from,
        to: recipient,
      });
      this.logger.log(`Notification envoyée : ${result.sid}`);
      return result;
    } catch (e) {
      this.logger.error(`Echec Twilio : ${e.message}`);
    }
  }
}
