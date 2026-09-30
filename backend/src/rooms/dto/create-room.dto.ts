import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerNight!: number;

  @IsString()
  @IsOptional()
  imageUrl?: string; // Champ pour stocker l'URL de la photo de la chambre
}