import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOptionItemDto {
  @ApiProperty({ example: 'Grande', description: "Label de l'option" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 500,
    description: 'Prix additionnel en FCFA',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalPrice?: number = 0;

  @ApiPropertyOptional({
    example: true,
    description: 'Disponibilit�',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean = true;
}
