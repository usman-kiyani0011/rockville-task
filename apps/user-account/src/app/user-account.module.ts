import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared';
import { UserAccountController } from './controllers/movies.controllers';

@Module({
  imports: [SharedModule, ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [UserAccountController],
  providers: [],
})
export class UserAccountModule {}
