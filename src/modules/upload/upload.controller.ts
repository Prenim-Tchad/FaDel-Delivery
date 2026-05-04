import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { R2StorageService } from './r2-storage.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly r2StorageService: R2StorageService) {}

  /**
   * Upload d'une image pour un restaurant ou un plat
   */
  @ApiOperation({ summary: 'Uploader une image (JPG, PNG, WEBP)' })
  @Post('restaurant-media')
  @UseInterceptors(FileInterceptor('file'))
  uploadRestaurantMedia(@UploadedFile() file: Express.Multer.File) {
    // Appel synchrone au service de stockage local
    const fileKey = this.r2StorageService.uploadFile(file, 'food-media');

    return {
      success: true,
      fileKey: fileKey,
      url: this.r2StorageService.getFileUrl(fileKey),
    };
  }

  /**
   * Suppression d'un média local via sa clé (ex: food-media/nom-du-fichier.jpg)
   */
  @ApiOperation({ summary: 'Supprimer un fichier via sa clé' })
  @Delete('remove')
  removeMedia(@Body('fileKey') fileKey: string) {
    this.r2StorageService.deleteFile(fileKey);

    return {
      success: true,
      message: 'Média supprimé avec succès',
    };
  }
}
