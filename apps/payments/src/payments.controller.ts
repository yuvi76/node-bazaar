import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Controller class for handling payments.
 */
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Creates a checkout session for the specified cart.
   * @param cartId The ID of the cart.
   * @returns A promise that resolves to the created checkout session.
   */
  @MessagePattern('create_checkout_session')
  async createCheckoutSession(@Payload() cartId: string) {
    return this.paymentsService.createCheckoutSession(cartId);
  }
}
