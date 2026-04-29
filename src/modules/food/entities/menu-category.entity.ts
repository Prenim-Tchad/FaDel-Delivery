import { ApiProperty } from '@nestjs/swagger';

export class MultiLangField {
  @ApiProperty({ example: 'Plats principaux' })
  fr!: string;

  @ApiProperty({ example: 'Main courses' })
  en!: string;

  @ApiProperty({ example: 'الأطباق الرئيسية' })
  ar!: string;

  @ApiProperty({ example: 'Platos principales' })
  es!: string;
}

export class MenuCategory {
  @ApiProperty({ example: 'menucat_1_1640995200000' })
  id!: string;

  @ApiProperty({ description: 'ID du restaurant' })
  restaurantId!: string;

  @ApiProperty({ type: MultiLangField })
  name!: MultiLangField;

  @ApiProperty({ type: MultiLangField, required: false })
  description?: MultiLangField;

  @ApiProperty({ example: 1 })
  sort_order!: number;

  @ApiProperty({
    description: 'Indique si la catégorie est supprimée (soft-delete)',
    example: false,
    default: false,
  })
  isDeleted!: boolean; // 🆕 soft-delete flag

  @ApiProperty({
    description: 'Date de suppression (null si pas supprimé)',
    example: null,
    required: false,
  })
  deletedAt?: Date | null; // 🆕 date de suppression

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
