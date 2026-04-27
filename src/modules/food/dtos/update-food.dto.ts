import { PartialType } from '@nestjs/swagger';
import { CreateFoodDto } from './create-food.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FoodStatus } from '../enums/food.enums';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @ApiProperty({
    description: 'Current status of the food item',
    enum: FoodStatus,
    example: FoodStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FoodStatus)
  status?: FoodStatus;
}