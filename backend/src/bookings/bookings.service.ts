import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RoomStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class BookingsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    // Initialisation simple de Stripe sans version d'API bloquante
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }

  async create(createBookingDto: CreateBookingDto) {
    const { userId, roomId, checkIn, checkOut } = createBookingDto as any;

    // 1. Récupérer la chambre par son ID (UUID) OU par son numéro (ex: "101")
    const room = await this.prisma.room.findFirst({
      where: {
        OR: [
          { id: roomId },
          { number: roomId },
        ],
      },
    });

    if (!room) {
      throw new NotFoundException('Chambre introuvable.');
    }
    if (room.status !== RoomStatus.AVAILABLE) {
      throw new BadRequestException('Cette chambre n\'est pas disponible.');
    }

    // 2. Calculer le nombre de nuits et le prix total
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      throw new BadRequestException('Les dates de séjour sont invalides.');
    }

    const totalPrice = diffDays * room.price;

    // 3. Créer la réservation en base avec un statut PENDING
    const booking = await this.prisma.booking.create({
      data: {
        userId,
        roomId: room.id, // On utilise l'ID réel trouvé en base
        checkIn: start,
        checkOut: end,
        totalPrice,
      },
      include: { room: true, user: true },
    });

    // 4. Créer une session Stripe Checkout
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // ou 'eur' selon ton choix
            product_data: {
              name: `Chambre n°${room.number} (${room.type})`,
              description: `Séjour du ${checkIn} au ${checkOut} (${diffDays} nuit(s))`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe attend les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?bookingId=${booking.id}`,
      cancel_url: `http://localhost:3000/cancel`,
      metadata: {
        bookingId: booking.id,
        roomId: room.id,
      },
    });

    // Enregistrer la session Stripe dans la table Payment
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        stripeSession: session.id,
        amount: totalPrice,
        status: PaymentStatus.PENDING,
      },
    });

    // Retourner l'objet de réservation et l'URL de paiement Stripe au frontend
    return {
      booking,
      checkoutUrl: session.url,
    };
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { user: true, room: true, payment: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, room: true, payment: true },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto as any,
    });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}