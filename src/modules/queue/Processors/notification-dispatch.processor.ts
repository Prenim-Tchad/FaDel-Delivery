import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES } from '../queue.constants';
import { NotificationJobData } from '../queue.service';

@Processor(QUEUE_NAMES.NOTIFICATION_DISPATCH)
export class NotificationDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationDispatchProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { type, recipientId, title, body } = job.data;
    this.logger.log(
      `Envoi notification: type=${type} | recipient=${recipientId}`,
    );

    switch (type) {
      case 'push':
        await this.sendPushNotification(job.data);
        break;
      case 'sms':
        await this.sendSms(job.data);
        break;
      case 'email':
        await this.sendEmail(job.data);
        break;
      default:
        this.logger.warn(`Type de notification inconnu: ${type}`);
    }
  }

  private async sendPushNotification(data: NotificationJobData): Promise<void> {
    this.logger.log(`Push → ${data.recipientId}: ${data.title}`);
    // TODO: intégrer Firebase FCM
  }

  private async sendSms(data: NotificationJobData): Promise<void> {
    this.logger.log(
      `SMS → ${data.recipientPhone ?? data.recipientId}: ${data.body}`,
    );
    // TODO: intégrer Twilio ou Africa's Talking
  }

  private async sendEmail(data: NotificationJobData): Promise<void> {
    this.logger.log(
      `Email → ${data.recipientEmail ?? data.recipientId}: ${data.title}`,
    );
    // TODO: intégrer SendGrid ou Resend
  }
}
