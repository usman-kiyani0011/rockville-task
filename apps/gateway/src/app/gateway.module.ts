import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesController } from './controllers/movies.contoller';
import { UserAccountController } from './controllers/user-account.controller';
import { SERVICES, SharedModule } from '@shared';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from './filters';
import { AuthGuard } from './guards/auth.guard';
import { ResponseInterceptor } from './interceptors';
@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
  ],
  controllers: [
    MoviesController,
    UserAccountController
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ...Object.values(SERVICES).map((SERVICE_NAME) => {
      return {
        provide: SERVICE_NAME,
        useFactory: (config: ConfigService) => {
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [config.get('RABBITMQ_HOST')],
              queue: `${SERVICE_NAME}_QUEUE`,
              prefetchCount: 1,
              queueOptions: {
                durable: false,
              },
            },
          });
        },
        inject: [ConfigService],
      };
    }),
  ],
})
export class GatewayModule { }
