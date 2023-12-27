import { NestFactory } from '@nestjs/core';
import { ReviewsModule } from './reviews.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Boots up the application by creating the NestJS app, configuring the Swagger documentation,
 * setting up global pipes, and listening on the specified HTTP port.
 */
async function bootstrap() {
  const app = await NestFactory.create(ReviewsModule);
  const config = new DocumentBuilder()
    .setTitle('Reviews API')
    .setDescription('Reviews API Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
