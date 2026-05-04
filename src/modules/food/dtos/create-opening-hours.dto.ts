import {
  IsInt,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OpeningHourItemDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0 = Dimanche, 1 = Lundi, etc.

  @IsString()
  openTime: string; // "08:00"

  @IsString()
  closeTime: string; // "18:00"

  @IsBoolean()
  isOpen: boolean;
}

export class CreateOpeningHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourItemDto)
  hours: OpeningHourItemDto[];
}
