import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DatabaseModule,
  AUTH_SERVICE,
  ErrorHandlerService,
  PRODUCT_SERVICE,
  ReviewsDocument,
  ReviewsSchema,
  HealthModule,
} from '@app/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';

/**
 * Module for managing reviews in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReviewsDocument.name, schema: ReviewsSchema },
    ]),
    ConfigModule.forRoot({
      envFilePath: 'apps/reviews/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PRODUCT_HOST: Joi.string().required(),
        PRODUCT_PORT: Joi.number().required(),
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
        name: PRODUCT_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PRODUCT_HOST'),
            port: configService.get('PRODUCT_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository, ErrorHandlerService],
  exports: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
