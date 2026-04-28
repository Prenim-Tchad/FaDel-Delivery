import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Assure-toi que c'est écrit comme ça :
    const serviceAccount = require(this.configService.get('FIREBASE_CREDENTIALS_PATH')!);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.logger.log('Firebase Admin SDK initialisé avec succès');
  }

  /**
   * Envoi à un seul appareil (Token spécifique)
   */
  async sendToDevice(token: string, title: string, body: string, data?: any) {
    const message = {
      notification: { title, body },
      data: data || {},
      token: token,
    };
    return admin.messaging().send(message);
  }

  /**
   * Envoi à plusieurs tokens (Multicast)
   */
  async sendMulticast(tokens: string[], title: string, body: string) {
    const message = {
      notification: { title, body },
      tokens: tokens,
    };
    return admin.messaging().sendEachForMulticast(message);
  }

  /**
   * Envoi par thématique (ex: topic = 'livreurs_ndjamena')
   */
  async sendToTopic(topic: string, title: string, body: string) {
    const message = {
      notification: { title, body },
      topic: topic,
    };
    return admin.messaging().send(message);
  }
}