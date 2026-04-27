import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsNumber, IsString, Min, Max } from 'class-validator';
import { FoodCategory, FoodType } from '../enums/food.enums';
import { Type } from 'class-transformer';

export class FoodFiltersDto {
  @ApiProperty({
    description: 'Filter by food category',
    enum: FoodCategory,
    required: false,
  })
  @IsOptional()
  @IsEnum(FoodCategory)
  category?: FoodCategory;

  @ApiProperty({
    description: 'Filter by food type (dietary restrictions)',
    enum: FoodType,
    required: false,
  })
  @IsOptional()
  @IsEnum(FoodType)
  type?: FoodType;

  @ApiProperty({
    description: 'Filter by partner/restaurant ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiProperty({
    description: 'Minimum price filter',
    example: 1000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    example: 5000,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Search by name or description',
    example: 'rice',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter featured items only',
    example: true,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}