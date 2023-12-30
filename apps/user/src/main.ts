import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Boots up the application by creating the NestJS app, configuring the Swagger documentation,
 * setting up global pipes, and listening on the specified HTTP port.
 */
async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User API Description')
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
