import { Controller, Post, Body, Req, Headers, HttpStatus, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() body: { bookingId: string; amount: number; userEmail: string }) {
    return this.paymentsService.createCheckoutSession(body.bookingId, body.amount, body.userEmail);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(
    @Req() req: Request & { rawBody: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
}