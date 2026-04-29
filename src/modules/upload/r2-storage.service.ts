import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class R2StorageService {
  private s3Client: S3Client;

  // AJOUTE BIEN LE MOT 'private' ICI
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get('R2_ENDPOINT')!,
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const key = `food-media/${Date.now()}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('R2_BUCKET_NAME'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `${this.configService.get('R2_PUBLIC_URL')}/${key}`;
  }
}
