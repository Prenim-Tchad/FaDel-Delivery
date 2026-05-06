import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { R2UploadService } from '../services/r2-upload.service';
import { MenuItemService } from '../services/menu-item.service';
import { UploadPhotoResponseDto } from '../dtos/upload-photo.dto';

/**
 * Controller MenuItemUpload — gère l'upload de photos d'articles
 *
 * Route :
 * POST /food/menu-items/:id/upload-photo → upload photo + thumbnail 150×150
 */
@ApiTags('food - menu items')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class MenuItemUploadController {
  constructor(
    private readonly r2UploadService: R2UploadService,
    private readonly menuItemService: MenuItemService,
  ) {}

  /**
   * POST /food/menu-items/:id/upload-photo
   * Upload une photo pour un article + génère thumbnail 150×150 px
   */
  @Post('menu-items/:id/upload-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Uploader une photo pour un article de menu',
    description:
      'Upload une image (JPEG/PNG/WebP, max 5MB). Génère automatiquement un thumbnail 150×150 px.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'article de menu',
    example: 'clxxx123',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPEG, PNG ou WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Photo uploadée avec succès',
    type: UploadPhotoResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Fichier manquant ou format invalide' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Article introuvable' })
  async uploadPhoto(
    @Param('id') menuItemId: string,
    @UploadedFile() file: { buffer: Buffer; mimetype: string; size: number },
  ): Promise<UploadPhotoResponseDto> {
    // Vérification que le fichier est présent
    if (!file) {
      throw new BadRequestException(
        'Aucun fichier reçu. Envoyez une image avec le champ "photo".',
      );
    }

    // Vérification que l'article existe
    await this.menuItemService.findOne(menuItemId);

    // Upload sur R2 + génération thumbnail
    const { originalUrl, thumbnailUrl } =
      await this.r2UploadService.uploadMenuItemPhoto(file, menuItemId);

    return { originalUrl, thumbnailUrl };
  }
}