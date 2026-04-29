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

  @Get('test-whatsapp')
  testMyPhone() {
    // 1. Retrait de 'async' car il n'y a pas de 'await' à l'intérieur
    const monNumero = '+23568383778';

    // 2. Utilisation de la variable pour éviter l'erreur 'no-unused-vars'
    console.log(`Test de notification pour le numéro : ${monNumero}`);

    return {
      success: true,
      target: monNumero,
    };
  }

  @Post('food')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFoodImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
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
