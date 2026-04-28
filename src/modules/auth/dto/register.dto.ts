import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: `"Adresse·email·de·l'utilisateur"`,
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: `"Mot·de·passe·de·l'utilisateur"`,
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: `"Nom·de·l'utilisateur"`,

    example: 'Dupont',
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({
    description: `"Prénom·de·l'utilisateur"`,
    example: 'Jean',
  })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({
    description: `"Numéro·de·téléphone"`,
    example: '+23566123456',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: `"Quartier·de·résidence"`,
    example: 'Chagoua',
    enum: [
      'Amriguébé',
      'Chagoua',
      'Dembé',
      'Farcha',
      'Goudji',
      'Habena',
      'Kabalaye',
      'Klemat',
      'Lamadji',
      'Moursal',
      'Ndjari',
      'Paris-Congo',
      'Sabangali',
      'Walia',
      'Autre',
    ],
  })
  @IsString()
  @IsNotEmpty()
  quartier: string;
}
