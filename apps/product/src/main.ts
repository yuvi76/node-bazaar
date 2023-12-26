import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Boots up the application by creating the NestJS app, configuring the Swagger documentation,
 * setting up global pipes, and listening on the specified HTTP port.
 */
async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const config = new DocumentBuilder()
    .setTitle('Product API')
    .setDescription('Product API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
