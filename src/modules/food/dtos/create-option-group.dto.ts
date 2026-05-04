import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsBoolean, 
  IsInt, 
  IsArray, 
  ValidateNested, 
  Min, 
  IsNumber 
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOptionDto {
  @ApiProperty({ description: "Nom de l'option", example: 'Fromage supplémentaire' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Supplément de prix', example: 500, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'Ordre d’affichage', example: 1, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class CreateOptionGroupDto {
  @ApiProperty({ description: 'Nom du groupe', example: 'Accompagnements' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Description du groupe', example: 'Choisissez votre garniture', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Sélection obligatoire', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({ description: 'Nombre minimum de choix', example: 0, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  minSelections?: number;

  @ApiProperty({ description: 'Nombre maximum de choix (null = illimité)', example: 1, required: false })
  @IsInt()
  @IsOptional()
  maxSelections?: number;

  @ApiProperty({ description: 'Ordre de tri', example: 0, required: false })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ description: 'Liste des options du groupe', type: [CreateOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options!: CreateOptionDto[];
}