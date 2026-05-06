import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

/**
 * Service R2UploadService — gère l'upload de fichiers sur Cloudflare R2
 *
 * Cloudflare R2 est compatible avec l'API S3 d'AWS
 * Ce service :
 * 1. Reçoit un fichier image (buffer)
 * 2. Génère un thumbnail 150×150 px via sharp
 * 3. Upload l'original ET le thumbnail sur R2
 * 4. Retourne les 2 URLs publiques
 */
@Injectable()
export class R2UploadService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT ?? '',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    });

    this.bucket = process.env.R2_BUCKET_NAME ?? 'food-media';
    this.publicUrl = process.env.R2_PUBLIC_URL ?? '';
  }

  /**
   * Upload une photo d'article de menu
   * @param file - Fichier reçu via multer
   * @param menuItemId - ID de l'article
   * @returns URLs de l'original et du thumbnail
   */
  async uploadMenuItemPhoto(
    file: { buffer: Buffer; mimetype: string; size: number },
    menuItemId: string,
  ): Promise<{ originalUrl: string; thumbnailUrl: string }> {
    // Validation du type de fichier
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Format non supporté. Utilisez JPEG, PNG ou WebP.',
      );
    }

    // Validation taille max 5 MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Fichier trop volumineux. Maximum : 5 MB.',
      );
    }

    // Noms de fichiers uniques
    const fileExtension = file.mimetype.split('/')[1];
    const uniqueId = randomUUID();
    const originalKey = `menu-items/${menuItemId}/original-${uniqueId}.${fileExtension}`;
    const thumbnailKey = `menu-items/${menuItemId}/thumbnail-${uniqueId}.jpg`;

    // Génération thumbnail 150×150 px
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(150, 150, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload original sur R2
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: originalKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // Upload thumbnail sur R2
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
      }),
    );

    return {
      originalUrl: `${this.publicUrl}/${originalKey}`,
      thumbnailUrl: `${this.publicUrl}/${thumbnailKey}`,
    };
  }
}