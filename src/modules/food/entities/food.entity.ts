import { ApiProperty } from '@nestjs/swagger';
import { FoodCategory, FoodStatus, FoodType } from '../enums/food.enums';

export class Food {
  @ApiProperty({
    description: 'Unique identifier of the food item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the food item',
    example: 'Jollof Rice',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the food item',
    example: 'Traditional West African rice dish with tomatoes, peppers, and spices',
  })
  description: string;

  @ApiProperty({
    description: 'Price of the food item in CFA francs',
    example: 2500,
  })
  price: number;

  @ApiProperty({
    description: 'Category of the food item',
    enum: FoodCategory,
    example: FoodCategory.MAIN_COURSE,
  })
  category: FoodCategory;

  @ApiProperty({
    description: 'Type of the food item (dietary restrictions)',
    enum: FoodType,
    example: FoodType.REGULAR,
  })
  type: FoodType;

  @ApiProperty({
    description: 'Current status of the food item',
    enum: FoodStatus,
    example: FoodStatus.AVAILABLE,
  })
  status: FoodStatus;

  @ApiProperty({
    description: 'URL of the food image',
    example: 'https://example.com/images/jollof-rice.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 30,
  })
  preparationTime: number;

  @ApiProperty({
    description: 'Ingredients list',
    example: ['rice', 'tomatoes', 'onions', 'peppers', 'spices'],
    type: [String],
  })
  ingredients: string[];

  @ApiProperty({
    description: 'Nutritional information',
    example: { calories: 450, protein: 12, carbs: 65, fat: 15 },
    required: false,
  })
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
  })
  isFeatured: boolean;

  @ApiProperty({
    description: 'Rating of the food item',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'Number of reviews',
    example: 127,
  })
  reviewCount: number;

  @ApiProperty({
    description: 'ID of the restaurant/partner offering this food',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  partnerId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}