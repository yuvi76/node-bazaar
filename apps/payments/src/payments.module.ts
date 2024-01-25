import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
  DatabaseModule,
  ErrorHandlerService,
  CartDocument,
  CartSchema,
  HealthModule,
} from '@app/common';

/**
 * Module for handling payments in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CartDocument.name, schema: CartSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TCP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [PaymentsController, ErrorHandlerService],
  providers: [PaymentsService],
})
export class PaymentsModule {}
