import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.configService.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Upload un fichier vers R2 avec gestion du type MIME
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype, // Gestion cruciale du type MIME ici
        }),
      );
      return fileName; // On stocke la clé (path) en DB, pas l'URL complète
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de l'upload vers R2");
    }
  }

  /**
   * Génère une URL de consultation (Publique ou Signée)
   */
  async getUrl(key: string): Promise<string> {
    // Si ton bucket est public :
    const publicUrl = this.configService.get('R2_PUBLIC_URL');
    return `${publicUrl}/${key}`;
  }

  /**
   * Supprime un fichier du bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de la suppression sur R2");
    }
  }
}