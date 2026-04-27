import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, IsObject, Min, Max, IsUUID } from 'class-validator';
import { FoodCategory, FoodStatus, FoodType } from '../enums/food.enums';

export class CreateFoodDto {
  @ApiProperty({
    description: 'Name of the food item',
    example: 'Jollof Rice',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the food item',
    example:` 'Traditional West African rice dish with tomatoes, peppers, and spices'`,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price of the food item in CFA francs',
    example: 2500,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Category of the food item',
    enum: FoodCategory,
    example: FoodCategory.MAIN_COURSE,
  })
  @IsEnum(FoodCategory)
  category: FoodCategory;

  @ApiProperty({
    description: 'Type of the food item (dietary restrictions)',
    enum: FoodType,
    example: FoodType.REGULAR,
  })
  @IsEnum(FoodType)
  type: FoodType;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 30,
  })
  @IsNumber()
  @Min(1)
  preparationTime: number;

  @ApiProperty({
    description: 'Ingredients list',
    example: ['rice', 'tomatoes', 'onions', 'peppers', 'spices'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({
    description: 'URL of the food image',
    example: 'https://example.com/images/jollof-rice.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Nutritional information',
    example: { calories: 450, protein: 12, carbs: 65, fat: 15 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @ApiProperty({
    description: 'Whether the food item is featured',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'ID of the restaurant/partner offering this food',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  partnerId: string;
}