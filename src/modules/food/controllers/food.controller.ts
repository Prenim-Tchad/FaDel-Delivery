import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MulterFile } from '../../../shared/types/multer.types';
import { CreateFoodDto } from '../dtos/create-food.dto';
import { FoodFiltersDto } from '../dtos/food-filters.dto';
import { UpdateFoodDto } from '../dtos/update-food.dto';
import { Food } from '../entities/food.entity';
import { FoodStatus } from '../enums/food.enums';
import { FoodService } from '../services/food.service';
import { MediaService, UploadResult } from '../services/media.service';

@ApiTags('food')
@ApiBearerAuth('JWT-auth')
@Controller('food')
export class FoodController {
  constructor(
    private readonly foodService: FoodService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new food item' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Food item created successfully',
    type: Food,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodService.create(createFoodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all food items with optional filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food items retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Food' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiQuery({ type: FoodFiltersDto })
  async findAll(@Query() filters: FoodFiltersDto) {
    return this.foodService.findAll(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured food items' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Featured food items retrieved successfully',
    type: [Food],
  })
  async findFeatured(): Promise<Food[]> {
    return this.foodService.findFeatured();
  }

  @Get('partner/:partnerId')
  @ApiOperation({ summary: 'Get food items by partner ID' })
  @ApiParam({
    name: 'partnerId',
    description: 'Partner ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Partner food items retrieved successfully',
    type: [Food],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid partner ID',
  })
  async findByPartner(
    @Param('partnerId', ParseUUIDPipe) partnerId: string,
  ): Promise<Food[]> {
    return this.foodService.findByPartner(partnerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a food item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Food item ID',
    example: 'food_1_1640995200000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food item retrieved successfully',
    type: Food,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Food item not found',
  })
  async findOne(@Param('id') id: string): Promise<Food> {
    return this.foodService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a food item' })
  @ApiParam({
    name: 'id',
    description: 'Food item ID',
    example: 'food_1_1640995200000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food item updated successfully',
    type: Food,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Food item not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ): Promise<Food> {
    return this.foodService.update(id, updateFoodDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update food item status' })
  @ApiParam({
    name: 'id',
    description: 'Food item ID',
    example: 'food_1_1640995200000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food item status updated successfully',
    type: Food,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Food item not found',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: FoodStatus,
  ): Promise<Food> {
    return this.foodService.updateStatus(id, status);
  }

  @Patch(':id/toggle-featured')
  @ApiOperation({ summary: 'Toggle featured status of a food item' })
  @ApiParam({
    name: 'id',
    description: 'Food item ID',
    example: 'food_1_1640995200000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Food item featured status toggled successfully',
    type: Food,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Food item not found',
  })
  async toggleFeatured(@Param('id') id: string): Promise<Food> {
    return this.foodService.toggleFeatured(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a food item' })
  @ApiParam({
    name: 'id',
    description: 'Food item ID',
    example: 'food_1_1640995200000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Food item deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Food item not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.foodService.remove(id);
  }

  // ── Upload image ──────────────────────────────────────────────────────────
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a food image to Cloudflare R2' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image uploaded successfully',
  })
  uploadImage(
    @UploadedFile() file: unknown, // ✅ type explicite
  ): Promise<UploadResult> {
    return this.mediaService.upload(file as MulterFile, 'foods');
  }
}
