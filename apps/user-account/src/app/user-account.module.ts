import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared';

@Module({
  imports: [SharedModule, ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [],
  providers: [],
})
export class UserAccountModule {}
