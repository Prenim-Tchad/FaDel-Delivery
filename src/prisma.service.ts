import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

/**
 * Ce service PrismaService étend le PrismaClient et implémente l'interface OnModuleInit de NestJS. Lors de l'initialisation du module, il se connecte automatiquement à la base de données. Vous pouvez injecter ce service dans vos autres services ou repositories pour interagir avec votre base de données via Prisma.
 */
