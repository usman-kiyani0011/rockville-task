import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@shared';
@Controller()
export class UserAccountController {
  constructor() {}

  @MessagePattern(RMQ_MESSAGES.USER_ACCOUNT.TEST)
  getFolders(@Payload() payload: any) {
    return { success: 'payload' };
  }
}
