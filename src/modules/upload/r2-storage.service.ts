import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class R2StorageService implements OnModuleInit {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly uploadRoot = path.join(process.cwd(), 'uploads');

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Création automatique du dossier /uploads s'il n'existe pas
    if (!fs.existsSync(this.uploadRoot)) {
      fs.mkdirSync(this.uploadRoot, { recursive: true });
      this.logger.log('Dossier racine /uploads initialisé localement.');
    }
  }

  /**
   * Sauvegarde le fichier localement.
   * Note : Le mot-clé async est retiré car fs.writeFileSync est bloquant (synchrone).
   * Cela règle l'erreur "@typescript-eslint/require-await".
   */
  uploadFile(file: Express.Multer.File, folder: string = 'food-media'): string {
    const targetFolder = path.join(this.uploadRoot, folder);

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        'Type de fichier non supporté. Utilisez JPG, PNG ou WEBP.',
      );
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    const filePath = path.join(targetFolder, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
      this.logger.log(`Fichier sauvegardé localement: ${folder}/${fileName}`);
      return `${folder}/${fileName}`;
    } catch (error: unknown) {
      // Sécurisation du message d'erreur pour régler "@typescript-eslint/no-unsafe-member-access"
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`Erreur d'écriture locale: ${message}`);
      throw new Error(message);
    }
  }

  /**
   * Supprime le fichier du disque local.
   */
  deleteFile(fileKey: string): void {
    try {
      const filePath = path.join(this.uploadRoot, fileKey);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Fichier local supprimé: ${fileKey}`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error(`Erreur de suppression locale: ${message}`);
    }
  }

  /**
   * Génère l'URL locale pour le frontend (React/Flutter)
   */
  getFileUrl(fileKey: string): string {
    const serverUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    return `${serverUrl}/uploads/${fileKey}`;
  }
}
