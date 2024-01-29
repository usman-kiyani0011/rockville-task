import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@shared';
@Controller()
export class MoviesController {
  constructor() {}

  @MessagePattern(RMQ_MESSAGES.MOVIES.TEST)
  getFolders(@Payload() payload: any) {
    return { success: 'payload' };
  }
}
