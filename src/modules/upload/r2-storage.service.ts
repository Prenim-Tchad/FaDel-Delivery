import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class R2StorageService {
  private s3Client: S3Client;

  constructor(private config: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.config.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const key = `food-media/${Date.now()}-${file.originalname}`;
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.config.get('R2_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    return `${this.config.get('R2_PUBLIC_URL')}/${key}`;
  }
}