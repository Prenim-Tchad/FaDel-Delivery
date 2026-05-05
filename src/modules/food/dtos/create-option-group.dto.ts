import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SelectionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export class CreateOptionItemDto {
  @ApiProperty({ example: 'Grande', description: 'Nom de l\'option' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 500, description: 'Prix supplémentaire en FCFA' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalPrice?: number = 0;
}

export class CreateOptionGroupDto {
  @ApiProperty({ example: 'Taille', description: 'Nom du groupe d\'options' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ enum: SelectionType, default: SelectionType.SINGLE })
  @IsOptional()
  @IsEnum(SelectionType)
  selectionType?: SelectionType = SelectionType.SINGLE;

  @ApiProperty({ type: [CreateOptionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionItemDto)
  options!: CreateOptionItemDto[];
}