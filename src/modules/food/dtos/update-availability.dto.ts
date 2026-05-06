import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * AvailabilityStatus — Tâche #38
 * 3 états possibles pour un article de menu
 */
export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE', // disponible et commandable
  HIDDEN = 'HIDDEN', // masqué (invisible pour le client)
  OUT_OF_STOCK = 'OUT_OF_STOCK', // épuisé (affiché grisé, non commandable)
}

/**
 * DTO — Tâche #38
 * Valide le body de PATCH /food/menu-items/:id/availability
 */
export class UpdateAvailabilityDto {
  @ApiProperty({
    enum: AvailabilityStatus,
    example: AvailabilityStatus.OUT_OF_STOCK,
    description: "Nouvel état de disponibilité de l'article",
  })
  @IsEnum(AvailabilityStatus)
  @IsNotEmpty()
  availability!: AvailabilityStatus;
}
