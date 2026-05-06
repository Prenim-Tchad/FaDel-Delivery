import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de réponse après upload d'une photo d'article
 * Retourne les URLs de l'original et du thumbnail
 */
export class UploadPhotoResponseDto {
  @ApiProperty({
    description: 'URL de l\'image originale sur Cloudflare R2',
    example: 'https://pub-xxx.r2.dev/menu-items/clxxx123/original-uuid.jpg',
  })
  originalUrl!: string;

  @ApiProperty({
    description: 'URL du thumbnail 150×150 px sur Cloudflare R2',
    example: 'https://pub-xxx.r2.dev/menu-items/clxxx123/thumbnail-uuid.jpg',
  })
  thumbnailUrl!: string;
}