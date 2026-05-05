import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES } from '../queue.constants';
import { NotificationJobData } from '../queue.service';

@Processor(QUEUE_NAMES.NOTIFICATION_DISPATCH)
export class NotificationDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationDispatchProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { type, recipientId } = job.data;
    this.logger.log(`Notification: type=${type} | recipient=${recipientId}`);

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
      default: {
        const exhaustive: never = type;
        this.logger.warn(`Type inconnu: ${String(exhaustive)}`);
      }
    }
  }

  private async sendPushNotification(data: NotificationJobData): Promise<void> {
    this.logger.log(`📱 Push → ${data.recipientId} | ${data.title}`);
    // TODO: intégrer Firebase FCM
    // await firebaseAdmin.messaging().send({
    //   token: deviceToken,
    //   notification: { title: data.title, body: data.body },
    //   data: data.data,
    // });
    await Promise.resolve(); // ✅ placeholder async
  }

  private async sendSms(data: NotificationJobData): Promise<void> {
    this.logger.log(
      `📱 SMS → ${data.recipientPhone ?? data.recipientId} | ${data.body}`,
    );
    // TODO: intégrer Africa's Talking (adapté Tchad)
    // await africasTalking.sms.send({
    //   to: data.recipientPhone,
    //   message: data.body,
    // });
    await Promise.resolve(); // ✅ placeholder async
  }

  private async sendEmail(data: NotificationJobData): Promise<void> {
    this.logger.log(
      `📧 Email → ${data.recipientEmail ?? data.recipientId} | ${data.title}`,
    );
    // TODO: intégrer Resend ou SendGrid
    // await resend.emails.send({
    //   to: data.recipientEmail,
    //   subject: data.title,
    //   html: data.body,
    // });
    await Promise.resolve(); // ✅ placeholder async
  }
}
