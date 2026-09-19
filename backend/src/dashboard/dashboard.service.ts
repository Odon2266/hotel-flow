import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // 1. Nombre total de chambres
    const totalRooms = await this.prisma.room.count();

    // 2. Nombre de chambres occupées (RoomStatus.BOOKED selon ton schéma)
    const occupiedRooms = await this.prisma.room.count({
      where: { status: 'BOOKED' },
    });

    // 3. Nombre de réservations actives (basé sur un paiement validé 'PAID')
    const activeReservations = await this.prisma.booking.count({
      where: {
        payment: {
          status: 'PAID',
        },
      },
    });

    // 4. Chiffre d'affaires du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueAggregate = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'PAID',
        createdAt: { gte: startOfMonth },
      },
    });

    const monthlyRevenue = monthlyRevenueAggregate._sum?.amount || 0;

    // 5. Calcul du taux d'occupation
    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      occupiedRooms,
      activeReservations,
      monthlyRevenue,
      occupancyRate,
    };
  }

  async getRecentBookings() {
    return this.prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            number: true,
            type: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
    });
  }
}