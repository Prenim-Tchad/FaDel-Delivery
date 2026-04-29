import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      const servicePath = './firebase-adminsdk.json';

      if (fs.existsSync(servicePath)) {
        const fileContent = fs.readFileSync(servicePath, 'utf8');
        const serviceAccount = JSON.parse(fileContent) as admin.ServiceAccount;

        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
          this.logger.log('Firebase Admin SDK initialisé avec succès');
        }
      } else {
        this.logger.warn('Fichier firebase-adminsdk.json manquant, FCM désactivé');
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Erreur d'initialisation Firebase : ${msg}`);
    }
  }

  /**
   * Envoi à un seul appareil
   */
  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string> {
    const messaging = admin.messaging();

    try {
      const message: admin.messaging.Message = {
        notification: { title, body },
        data: data || {},
        token: token,
      };

      const response: string = await messaging.send(message);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'FCM Send Error';
      this.logger.error(`Erreur envoi device: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Envoi à plusieurs tokens
   * Utilisation de 'sendMulticast' pour la compatibilité
   */
  async sendMulticast(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<admin.messaging.BatchResponse> {
    const messaging = admin.messaging();

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: { title, body },
        tokens: tokens,
      };

      // Utilisation de sendMulticast au lieu de sendEachForMulticast
      const response: admin.messaging.BatchResponse = await messaging.sendMulticast(message);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'FCM Multicast Error';
      throw new Error(errorMessage);
    }
  }

  /**
   * Envoi par thématique
   */
  async sendToTopic(
    topic: string,
    title: string,
    body: string,
  ): Promise<string> {
    const messaging = admin.messaging();

    try {
      const message: admin.messaging.TopicMessage = {
        notification: { title, body },
        topic: topic,
      };

      const response: string = await messaging.send(message);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'FCM Topic Error';
      throw new Error(errorMessage);
    }
  }
}