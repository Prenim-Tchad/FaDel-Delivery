import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2StorageService } from './r2-storage.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2Service: R2StorageService) {}
  @Get('test-whatsapp') // <-- N'oublie pas le décorateur
  async testMyPhone() {
    // <-- Vérifie qu'il n'y a pas de "function" écrit devant
    const monNumero = '+23568383778';
    // ton code...
    return { success: true };
  }

  @Post('food')
  @UseInterceptors(FileInterceptor('file')) // 'file' est le nom du champ envoyé par Flutter
  async uploadFoodImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1. Limite à 2 Mo (2 * 1024 * 1024 octets)
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          // 2. Vérifie le type MIME (Regex pour images classiques)
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this.r2Service.upload(file);
    return {
      message: 'Image uploadée avec succès',
      url: url,
    };
  }
}
