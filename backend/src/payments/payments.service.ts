import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
  private endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(bookingId: string, amount: number, userEmail: string) {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        message: "Clé Stripe absente, simulation réussie",
        url: `http://localhost:3001/success?bookingId=${bookingId}`,
        sessionId: 'cs_test_mock_123',
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Réservation Hôtel - ${bookingId}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3001/cancel`,
      metadata: { bookingId },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      if (this.endpointSecret && process.env.STRIPE_SECRET_KEY) {
        event = this.stripe.webhooks.constructEvent(rawBody, signature, this.endpointSecret);
      } else {
        event = JSON.parse(rawBody.toString()) as Stripe.Event;
      }
    } catch (err: any) {
      throw new BadRequestException(`Erreur de signature Webhook : ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await this.prisma.booking
          .update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' } as any,
          })
          .catch(() => {
            console.log(`Réservation ${bookingId} introuvable en base de données.`);
          });

        console.log(`Paiement réussi pour la réservation : ${bookingId}`);
      }
    }

    return { received: true };
  }
}