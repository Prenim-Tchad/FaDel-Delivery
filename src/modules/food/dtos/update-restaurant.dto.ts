import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({
    description: 'Restaurant actif ou non',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Restaurant vérifié ou non',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
