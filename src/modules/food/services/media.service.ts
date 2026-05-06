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
import sharp from 'sharp'; // Import pour le redimensionnement automatique des images
import { MulterFile } from '../../../shared/types/multer.types';

// ── Types MIME autorisés ──────────────────────────────────────────────────
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Résultat d'un upload de fichier vers Cloudflare R2
 * @interface UploadResult
 * @property {string} key - Clé unique du fichier dans le bucket R2
 * @property {string} url - URL publique d'accès au fichier
 * @property {string} mimetype - Type MIME du fichier uploaddé
 * @property {number} size - Taille du fichier en octets après traitement
 */
export interface UploadResult {
  key: string;
  url: string;
  mimetype: string;
  size: number;
}

/**
 * Options de redimensionnement des images avec Sharp.js
 * @interface ResizeOptions
 * @property {number} [width] - Largeur cible de l'image en pixels
 * @property {number} [height] - Hauteur cible de l'image en pixels
 * @property {'cover'|'contain'|'fill'|'inside'|'outside'} [fit] - Mode d'ajustement de l'image. Par défaut: 'cover'
 * @property {number} [quality] - Qualité de compression (0-100). Par défaut: 80
 */
export interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
}
/**
 * Service pour gérer l'upload et la gestion des fichiers media vers Cloudflare R2
 * @class MediaService
 * @description Utilise l'API S3 compatible avec Cloudflare R2 pour l'upload de fichiers
 * et le redimensionnement automatique des images avec Sharp.js
 */
@Injectable()
export class MediaService {
  /** Client S3 pour communiquer avec Cloudflare R2 */
  private readonly s3: S3Client;
  /** Nom du bucket Cloudflare R2 */
  private readonly bucket: string;
  /** URL publique du bucket R2 pour accéder aux fichiers */
  private readonly publicUrl: string;
  /** ID du compte Cloudflare */
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

  /**
   * Uploade un fichier vers Cloudflare R2 avec redimensionnement automatique optionnel
   * @method upload
   * @param {MulterFile} file - Fichier à uploader (depuis multipart/form-data)
   * @param {string} [folder='foods'] - Dossier de destination dans le bucket
   * @param {ResizeOptions} [resizeOptions] - Options de redimensionnement des images
   * @returns {Promise<UploadResult>} Résultat de l'upload contenant clé, URL et métadonnées
   * @throws {BadRequestException} Si le type MIME n'est pas autorisé ou fichier trop volumineux
   * @throws {InternalServerErrorException} Si l'upload ou le redimensionnement échoue
   */
  async upload(
    file: MulterFile,
    folder = 'foods',
    resizeOptions?: ResizeOptions,
  ): Promise<UploadResult> {
    const mimetype: string = file.mimetype;
    const size: number = file.size;
    let buffer: Buffer = file.buffer;
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

    // Redimensionnement automatique des images avec Sharp si des options sont fournies
    if (resizeOptions && mimetype.startsWith('image/')) {
      try {
        let sharpInstance = sharp(buffer);

        if (resizeOptions.width || resizeOptions.height) {
          sharpInstance = sharpInstance.resize({
            width: resizeOptions.width,
            height: resizeOptions.height,
            fit: resizeOptions.fit || 'cover',
            withoutEnlargement: true,
          });
        }

        if (
          resizeOptions.quality &&
          (mimetype === 'image/jpeg' || mimetype === 'image/webp')
        ) {
          sharpInstance = sharpInstance.jpeg({
            quality: resizeOptions.quality,
          });
        }

        buffer = await sharpInstance.toBuffer();
      } catch (error) {
        throw new InternalServerErrorException(
          `Erreur redimensionnement image: ${error instanceof Error ? error.message : 'Inconnue'}`,
        );
      }
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
      size: buffer.length,
    };
  }

  /**
   * Supprime un fichier du bucket Cloudflare R2
   * @method delete
   * @param {string} key - Clé du fichier à supprimer
   * @returns {Promise<void>}
   * @throws {BadRequestException} Si la clé est invalide
   * @throws {InternalServerErrorException} Si la suppression échoue
   */
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

  /**
   * Génère l'URL publique d'accès à un fichier dans le bucket R2
   * @method getPublicUrl
   * @param {string} key - Clé du fichier dans le bucket
   * @returns {string} URL publique d'accès au fichier
   */
  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${key}`;
  }

  /**
   * Génère une URL signée avec expiration pour l'accès temporaire à un fichier
   * @method getSignedUrl
   * @param {string} key - Clé du fichier
   * @param {number} [expiresInSeconds=3600] - Délai d'expiration de l'URL en secondes (1h par défaut)
   * @returns {Promise<string>} URL signée pour accès temporaire
   * @throws {BadRequestException} Si la clé est invalide
   * @throws {InternalServerErrorException} Si la génération échoue
   */
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

  /**
   * Extrait la clé du fichier depuis une URL publique
   * @method extractKeyFromUrl
   * @param {string} url - URL publique du fichier
   * @returns {string} Clé du fichier extraite de l'URL
   * @throws {BadRequestException} Si l'URL est invalide
   */
  extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '');
    } catch {
      throw new BadRequestException(`URL invalide: ${url}`);
    }
  }

  /**
   * Vérifie si un type MIME est autorisé pour l'upload
   * @method isAllowedMimeType
   * @param {string} mimetype - Type MIME à vérifier
   * @returns {boolean} true si le type MIME est autorisé, false sinon
   */
  isAllowedMimeType(mimetype: string): boolean {
    return mimetype in ALLOWED_MIME_TYPES;
  }

  /**
   * Remplace un fichier existant par une nouvelle version avec redimensionnement optionnel
   * @method replace
   * @param {string} oldKey - Clé du fichier existant à supprimer
   * @param {MulterFile} newFile - Nouveau fichier à uploader
   * @param {string} [folder='foods'] - Dossier de destination
   * @param {ResizeOptions} [resizeOptions] - Options de redimensionnement du nouveau fichier
   * @returns {Promise<UploadResult>} Résultat de l'upload du nouveau fichier
   */
  async replace(
    oldKey: string,
    newFile: MulterFile,
    folder = 'foods',
    resizeOptions?: ResizeOptions,
  ): Promise<UploadResult> {
    const result = await this.upload(newFile, folder, resizeOptions);
    try {
      await this.delete(oldKey);
    } catch {
      // On ne fait pas échouer si l'ancien fichier n'existe plus
    }
    return result;
  }
}
