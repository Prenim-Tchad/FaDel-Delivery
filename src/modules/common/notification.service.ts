import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message'; // 1. Import du type pour le résultat

@Injectable()
export class NotificationService {
  private client: Twilio;
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly config: ConfigService) {
    // 2. Typage explicite des configurations pour éviter le type 'any'
    const accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      this.logger.error('Configurations Twilio manquantes !');
      throw new Error('Twilio credentials not found');
    }

    this.client = new Twilio(accountSid, authToken);
  }

  /**
   * Envoie une alerte de commande au client
   */
  async sendOrderConfirmation(
    to: string,
    orderId: string,
    amount: number,
    neighborhood: string,
  ): Promise<MessageInstance | undefined> {
    const message = `🍟 *FaDel Express*\n\nBonjour ! Votre commande #${orderId} de ${amount} FCFA vers ${neighborhood} est confirmée. Un livreur arrive bientôt !`;

    return this.sendMessage(to, message, true);
  }

  /**
   * Alerte pour le livreur (Module #23 + #25)
   */
  async sendDriverAlert(
    to: string,
    distance: string,
    price: number,
    pickup: string,
  ): Promise<MessageInstance | undefined> {
    const message = `🚲 *Nouvelle Course FaDel*\n\nDistance : ${distance}\nGain : ${price} FCFA\nLieu : ${pickup}\n\nRépondez 'OUI' pour accepter.`;

    return this.sendMessage(to, message, true);
  }

  private async sendMessage(
    to: string,
    body: string,
    useWhatsApp: boolean,
  ): Promise<MessageInstance | undefined> {
    const from = useWhatsApp
      ? `whatsapp:${this.config.get<string>('TWILIO_WHATSAPP_NUMBER')}`
      : this.config.get<string>('TWILIO_PHONE_NUMBER');

    const recipient = useWhatsApp ? `whatsapp:${to}` : to;

    try {
      // 3. Typage du résultat de l'appel API
      const result: MessageInstance = await this.client.messages.create({
        body,
        from: from!,
        to: recipient,
      });

      this.logger.log(`Notification envoyée : ${result.sid}`);
      return result;
    } catch (e: unknown) {
      // 4. Gestion sécurisée de l'erreur pour le Lint
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown Twilio Error';
      this.logger.error(`Echec Twilio : ${errorMessage}`);
      return undefined;
    }
  }
}
