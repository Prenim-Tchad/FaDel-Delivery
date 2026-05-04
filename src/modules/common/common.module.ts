import { Module, Global } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Global() // Rendre le module global permet d'utiliser les services partout sans ré-import
@Module({
  providers: [FcmService, NotificationService],
  controllers: [NotificationController],
  exports: [FcmService, NotificationService],
})
export class CommonModule {}
