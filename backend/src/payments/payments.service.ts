import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

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
}