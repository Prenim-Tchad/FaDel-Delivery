import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Nom de l\'utilisateur',
    example: 'Dupont',
  })
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional({
    description: 'Prénom de l\'utilisateur',
    example: 'Jean',
  })
  @IsOptional()
  @IsString()
  prenom?: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone',
    example: '+23566123456',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Quartier de résidence',
    example: 'Chagoua',
    enum: ['Amriguébé', 'Chagoua', 'Dembé', 'Farcha', 'Goudji', 'Habena', 'Kabalaye', 'Klemat', 'Lamadji', 'Moursal', 'Ndjari', 'Paris-Congo', 'Sabangali', 'Walia', 'Autre'],
  })
  @IsOptional()
  @IsString()
  quartier?: string;
}
