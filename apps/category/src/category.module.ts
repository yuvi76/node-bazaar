import { Module } from "@nestjs/common";
import * as Joi from "joi";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  DatabaseModule,
  AUTH_SERVICE,
  ErrorHandlerService,
  CategoryDocument,
  CategorySchema,
} from "@app/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";

/**
 * Represents the Category module.
 * This module is responsible for managing categories in the node-bazaar microservice.
 */
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CategoryDocument.name, schema: CategorySchema },
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
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, ErrorHandlerService],
  exports: [CategoryService],
})
export class CategoryModule {}
