import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        number: createRoomDto.number,
        type: createRoomDto.type,
        price: createRoomDto.pricePerNight,
        imageUrl: createRoomDto.imageUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: { reservations: true }, // Corrigé de 'bookings' à 'reservations'
    });
  }

  async findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: { reservations: true }, // Corrigé de 'bookings' à 'reservations'
    });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: {
        ...(updateRoomDto.number && { number: updateRoomDto.number }),
        ...(updateRoomDto.type && { type: updateRoomDto.type }),
        ...(updateRoomDto.pricePerNight !== undefined && { price: updateRoomDto.pricePerNight }),
        ...(updateRoomDto.imageUrl !== undefined && { imageUrl: updateRoomDto.imageUrl }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}