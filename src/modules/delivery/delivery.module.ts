import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DeliveryService } from './delivery.service';
// Importez le contrôleur si vous en avez déjà un, sinon commentez la ligne
// import { DeliveryController } from './delivery.controller';

@Module({
  imports: [
    HttpModule, // Indispensable pour l'API Google Maps (Axios)
    ConfigModule, // Indispensable pour lire le fichier .env
  ],
  controllers: [], // Ajoutez DeliveryController ici plus tard
  providers: [DeliveryService],
  exports: [DeliveryService], // Permet à d'autres modules (ex: Orders) d'utiliser vos calculs
})
export class DeliveryModule {}
