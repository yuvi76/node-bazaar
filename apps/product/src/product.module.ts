import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_SERVICE,
  DatabaseModule,
  ErrorHandlerService,
  ProductDocument,
  ProductSchema,
  ReviewsDocument,
  ReviewsSchema,
} from '@app/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

/**
 * Module for managing products in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
      { name: ReviewsDocument.name, schema: ReviewsSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: 'apps/product/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        TCP_HOST: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
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
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ErrorHandlerService],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
