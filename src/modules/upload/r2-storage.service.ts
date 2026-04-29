import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // 1. Import manquant ajouté

@Injectable()
export class R2StorageService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('R2_ENDPOINT')!,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'R2_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const key = `food-media/${Date.now()}-${file.originalname}`;
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME');
    const publicUrl = this.configService.get<string>('R2_PUBLIC_URL');

    try {
      // 2. Utilisation d'une commande typée pour éviter 'no-unsafe-call'
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      return `${publicUrl}/${key}`;
    } catch (error: unknown) {
      // 3. Gestion sécurisée de l'erreur pour le Lint
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`Erreur d'upload R2: ${errorMessage}`);
      throw new Error(`Échec du stockage de l'image: ${errorMessage}`);
    }
  }
}
