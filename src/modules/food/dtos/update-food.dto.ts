import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FoodStatus } from '../enums/food.enums';
import { CreateFoodDto } from './create-food.dto';

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
