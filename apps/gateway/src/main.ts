import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { GatewayModule } from './app/gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const options = new DocumentBuilder()
    .setTitle('Movie App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  await app.listen(config.get('GATEWAY_PORT'));
  Logger.log(
    `🚀 Application is running on: http://localhost:${config.get(
      'GATEWAY_PORT'
    )}`
  );
}

bootstrap();
