import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@shared';
import { UserController } from './controllers/user.controllers';
import { UserService } from './services/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserAccountModule {}
