import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() body: { bookingId: string; amount: number; userEmail: string }) {
    return this.paymentsService.createCheckoutSession(body.bookingId, body.amount, body.userEmail);
  }
}