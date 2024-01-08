import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
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
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
