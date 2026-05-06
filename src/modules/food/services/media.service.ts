import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { MulterFile } from '../../../shared/types/multer.types';

// ── Types MIME autorisés ──────────────────────────────────────────────────
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadResult {
  key: string;
  url: string;
  mimetype: string;
  size: number;
}
@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly accountId: string;

  constructor(private readonly configService: ConfigService) {
    // ✅ Types explicites string avec valeur par défaut
    const accountId: string =
      this.configService.get<string>('R2_ACCOUNT_ID') ?? '';
    const accessKeyId: string =
      this.configService.get<string>('R2_ACCESS_KEY_ID') ?? '';
    const secretAccessKey: string =
      this.configService.get<string>('R2_SECRET_ACCESS_KEY') ?? '';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new InternalServerErrorException(
        'Configuration Cloudflare R2 manquante (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)',
      );
    }

    this.accountId = accountId;
    this.bucket =
      this.configService.get<string>('R2_BUCKET_NAME') ?? 'food-media';
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') ?? '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  async upload(
    file: MulterFile, // ✅ type explicite
    folder = 'foods',
  ): Promise<UploadResult> {
    const mimetype: string = file.mimetype;
    const size: number = file.size;
    const buffer: Buffer = file.buffer;
    const originalname: string = file.originalname;

    // Validation type MIME
    const ext: string | undefined = ALLOWED_MIME_TYPES[mimetype];
    if (!ext) {
      throw new BadRequestException(
        `Type de fichier non autorisé: ${mimetype}. ` +
          `Types acceptés: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`,
      );
    }

    // Validation taille
    if (size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB`,
      );
    }

    const key = `${folder}/${randomUUID()}${ext}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
          ContentLength: size,
          Metadata: {
            originalName: Buffer.from(originalname).toString('base64'),
          },
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur upload R2: ${error instanceof Error ? error.message : 'Inconnue'}`,
      );
    }

    return {
      key,
      url: this.getPublicUrl(key),
      mimetype,
      size,
    };
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async delete(key: string): Promise<void> {
    if (!key || key.trim() === '') {
      throw new BadRequestException('Clé de fichier invalide');
    }

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur suppression R2: ${error instanceof Error ? error.message : 'Inconnue'}`,
      );
    }
  }

  // ── URL publique ──────────────────────────────────────────────────────────
  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${key}`;
  }

  // ── URL signée (accès temporaire) ─────────────────────────────────────────
  async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    if (!key || key.trim() === '') {
      throw new BadRequestException('Clé de fichier invalide');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur génération URL signée: ${error instanceof Error ? error.message : 'Inconnue'}`,
      );
    }
  }

  // ── Extraire la clé depuis une URL ────────────────────────────────────────
  extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '');
    } catch {
      throw new BadRequestException(`URL invalide: ${url}`);
    }
  }

  // ── Vérifier si un type MIME est autorisé ─────────────────────────────────
  isAllowedMimeType(mimetype: string): boolean {
    return mimetype in ALLOWED_MIME_TYPES;
  }

  // ── Remplacer un fichier existant ─────────────────────────────────────────
  async replace(
    oldKey: string,
    newFile: MulterFile,
    folder = 'foods',
  ): Promise<UploadResult> {
    const result = await this.upload(newFile, folder);
    try {
      await this.delete(oldKey);
    } catch {
      // On ne fait pas échouer si l'ancien fichier n'existe plus
    }
    return result;
  }
}
