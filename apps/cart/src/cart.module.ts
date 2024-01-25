import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DatabaseModule,
  AUTH_SERVICE,
  ErrorHandlerService,
  CartDocument,
  CartSchema,
  ProductDocument,
  ProductSchema,
  PAYMENTS_SERVICE,
  HealthModule,
} from '@app/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';

/**
 * Represents the Cart module.
 * This module is responsible for managing carts in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CartDocument.name, schema: CartSchema },
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ErrorHandlerService],
  exports: [CartService],
})
export class CartModule {}
