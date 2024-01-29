import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { RMQ_MESSAGES, SERVICES } from '@shared';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { firstValueFrom } from 'rxjs';
const {
  AUTH: { VERIFY_TOKEN },
} = RMQ_MESSAGES.USER_ACCOUNT;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(SERVICES.USER_ACCOUNT) private readonly authService: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>(
      'secured',
      context.getHandler()
    );
    if (!secured) return true;

    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Authorization Token Missing!');
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await firstValueFrom(
        this.authService.send(VERIFY_TOKEN, { token: authToken })
      );
      request.user = resp;
      return true;
    } catch (error) {
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In'
      );
    }
  }
}
