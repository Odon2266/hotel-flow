import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  userId: string;

  @IsString()
  roomId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  totalPrice: number;
}