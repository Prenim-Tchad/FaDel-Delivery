import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RestaurantService } from '../services/restaurant.service';
import type { BatchPayloadResult } from '../repositories/restaurant.repository';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';
import type { CreateDeliveryZonesDto } from '../dtos/create-delivery-zone.dto';
import { RestaurantOwnerGuard } from '../guards/restaurant-owner.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole, RestaurantStatus } from '../../../shared/types';
import { FileUploadService } from '../../../shared/services/file-upload.service';

@Controller('food/restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @UseGuards(RestaurantOwnerGuard)
  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto): Promise<unknown> {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  findAll(): Promise<unknown[]> {
    return this.restaurantService.findAll();
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
  ): Promise<unknown[]> {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const radiusKm = Number(radius);

    if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(radiusKm)) {
      throw new BadRequestException(
        'Les paramètres lat, lng et radius doivent être des nombres valides.',
      );
    }

    if (radiusKm <= 0) {
      throw new BadRequestException('Le paramètre radius doit être supérieur à 0.');
    }

    return this.restaurantService.findNearby(latitude, longitude, radiusKm);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<unknown> {
    return this.restaurantService.findOne(id);
  }

  @UseGuards(RestaurantOwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<unknown> {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: RestaurantStatus,
  ): Promise<unknown> {
    return this.restaurantService.updateStatus(id, status);
  }

  // --- #13 : L'endpoint pour les horaires ---
  @UseGuards(RestaurantOwnerGuard)
  @Post(':id/opening-hours')
  async setOpeningHours(
    @Param('id') id: string,
    @Body() dto: CreateOpeningHoursDto,
  ): Promise<BatchPayloadResult> {
    return this.restaurantService.updateOpeningHours(id, dto);
  }

  // --- #16 : L'endpoint pour les zones de livraison ---
  @UseGuards(RestaurantOwnerGuard)
  @Post(':id/delivery-zones')
  async setDeliveryZones(
    @Param('id') id: string,
    @Body() dto: CreateDeliveryZonesDto,
  ): Promise<BatchPayloadResult> {
    return this.restaurantService.updateDeliveryZones(id, dto);
  }

  @UseGuards(RestaurantOwnerGuard)
  @UseInterceptors(FileInterceptor('logo'))
  @Post(':id/upload-logo')
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ logoUrl: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier logo fourni');
    }

    const logoUrl = await this.fileUploadService.uploadFile(file, 'restaurant-logos');
    await this.restaurantService.updateLogo(id, logoUrl);

    return { logoUrl };
  }

  @UseGuards(RestaurantOwnerGuard)
  @UseInterceptors(FilesInterceptor('photos', 10)) // Max 10 photos
  @Post(':id/upload-photos')
  async uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ photoUrls: string[] }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier photo fourni');
    }

    const photoUrls = await this.fileUploadService.uploadMultipleFiles(files, 'restaurant-photos');
    await this.restaurantService.addPhotos(id, photoUrls);

    return { photoUrls };
  }

  @UseGuards(RestaurantOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<unknown> {
    return this.restaurantService.remove(id);
  }
}
