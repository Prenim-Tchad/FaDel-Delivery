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

  @Post('food')
  @UseInterceptors(FileInterceptor('file')) // 'file' est le nom du champ envoyé par Flutter
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
