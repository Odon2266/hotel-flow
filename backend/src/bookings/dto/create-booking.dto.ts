import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  userId!: string;

  @IsString()
  roomId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @IsNumber()
  @IsOptional()
  totalPrice?: number; // Optionnel car calculé automatiquement par le backend
}