import { Module } from "@nestjs/common";
import * as Joi from "joi";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  DatabaseModule,
  AUTH_SERVICE,
  ErrorHandlerService,
  OrdersDocument,
  OrdersSchema,
  PAYMENTS_SERVICE,
  CartDocument,
  CartSchema,
} from "@app/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./orders.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";

/**
 * Represents the Orders module.
 * This module is responsible for managing orders in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: OrdersDocument.name, schema: OrdersSchema },
      { name: CartDocument.name, schema: CartSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get("AUTH_HOST"),
            port: configService.get("AUTH_PORT"),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get("PAYMENTS_HOST"),
            port: configService.get("PAYMENTS_PORT"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, ErrorHandlerService],
  exports: [OrdersService],
})
export class OrdersModule {}
