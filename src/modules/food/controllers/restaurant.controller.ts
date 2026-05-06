import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RestaurantStatus, UserRole } from '../../../shared/types';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import type { CreateDeliveryZonesDto } from '../dtos/create-delivery-zone.dto';
import { CreateOpeningHoursDto } from '../dtos/create-opening-hours.dto';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { RestaurantOwnerGuard } from '../guards/restaurant-owner.guard';
import type { BatchPayloadResult } from '../repositories/restaurant.repository';
import { RestaurantService } from '../services/restaurant.service';

@Controller('food/restaurants')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly mediaService: MediaService, // Service pour gérer l'upload vers Cloudflare R2
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

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      Number.isNaN(radiusKm)
    ) {
      throw new BadRequestException(
        'Les paramètres lat, lng et radius doivent être des nombres valides.',
      );
    }

    if (radiusKm <= 0) {
      throw new BadRequestException(
        'Le paramètre radius doit être supérieur à 0.',
      );
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
  @Delete(':id')
  remove(@Param('id') id: string): Promise<unknown> {
    return this.restaurantService.remove(id);
  }

  /**
   * Upload le logo du restaurant vers Cloudflare R2
   * @method uploadLogo
   * @route POST /food/restaurants/:id/upload-logo
   * @param {string} id - ID du restaurant
   * @param {Express.Multer.File} file - Fichier logo (form-data : key='logo')
   * @returns {Promise<{logoUrl: string}>} URL publique du logo uploadé
   * @throws {BadRequestException} Si aucun fichier n'est fourni
   * @description Redimensionne automatiquement à 200x200px et optimise la qualité à 85%
   */
  // --- Upload logo du restaurant ---
  @UseGuards(RestaurantOwnerGuard)
  @Post(':id/upload-logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ logoUrl: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier logo fourni');
    }

    // Options de redimensionnement pour le logo (carré, plus petit)
    const resizeOptions: ResizeOptions = {
      width: 200,
      height: 200,
      fit: 'cover',
      quality: 85,
    };

    const result = await this.mediaService.upload(
      file,
      'restaurant-logos',
      resizeOptions,
    );
    await this.restaurantService.updateLogo(id, result.url);

    return { logoUrl: result.url };
  }

  /**
   * Upload la bannière (image de couverture) du restaurant vers Cloudflare R2
   * @method uploadBanner
   * @route POST /food/restaurants/:id/upload-banner
   * @param {string} id - ID du restaurant
   * @param {Express.Multer.File} file - Fichier bannière (form-data : key='banner')
   * @returns {Promise<{coverImageUrl: string}>} URL publique de la bannière uploadée
   * @throws {BadRequestException} Si aucun fichier n'est fourni
   * @description Redimensionne automatiquement à 1200x400px et optimise la qualité à 85%
   */
  // --- Upload bannière du restaurant ---
  @UseGuards(RestaurantOwnerGuard)
  @Post(':id/upload-banner')
  @UseInterceptors(FileInterceptor('banner'))
  async uploadBanner(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ coverImageUrl: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier bannière fourni');
    }

    // Options de redimensionnement pour la bannière (plus large, pour affichage en en-tête)
    const resizeOptions: ResizeOptions = {
      width: 1200,
      height: 400,
      fit: 'cover',
      quality: 85,
    };

    const result = await this.mediaService.upload(
      file,
      'restaurant-banners',
      resizeOptions,
    );
    await this.restaurantService.updateCoverImage(id, result.url);

    return { coverImageUrl: result.url };
  }
}
