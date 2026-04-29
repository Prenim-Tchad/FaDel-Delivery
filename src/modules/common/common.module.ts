import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  providers: [FcmService, NotificationService],
  controllers: [NotificationController],
  exports: [FcmService, NotificationService],
})
export class CommonModule {}
