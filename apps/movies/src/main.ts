import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SERVICES } from '@shared';
import { ValidationPipe } from '@nestjs/common';
import { MoviesModule } from './app/movies.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MoviesModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_HOST],
        queue: `${SERVICES.MOVIES}_QUEUE`,
        queueOptions: {
          durable: false,
        },
      },
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  await app.listen();
}

bootstrap();
