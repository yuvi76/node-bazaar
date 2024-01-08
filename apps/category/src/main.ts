import { NestFactory } from '@nestjs/core';
import { CategoryModule } from './category.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Boots up the application by creating a NestFactory instance,
 * configuring the Swagger documentation, setting up global pipes,
 * and listening for incoming requests on the specified port.
 */
async function bootstrap() {
  const app = await NestFactory.create(CategoryModule);
  const config = new DocumentBuilder()
    .setTitle('Category API')
    .setDescription('Category API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  app.enableCors();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
