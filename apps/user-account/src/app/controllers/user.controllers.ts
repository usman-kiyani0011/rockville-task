import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ChangePasswordRequestDto,
  RMQ_MESSAGES,
  SignInRequestDto,
  SignUpRequestDto,
  UpdateProfileRequestDto,
} from '@shared';
import { UserService } from '../services/user.service';
const {
  AUTH: { SIGNUP, SIGNIN, CHANGE_PASSWORD, VERIFY_TOKEN },
  PROFILE: { UPDATE_PROFILE },
} = RMQ_MESSAGES.USER_ACCOUNT;
@Controller()
export class UserController {
  constructor(private readonly userAccountService: UserService) {}
  @MessagePattern(SIGNUP)
  async signUp(@Payload() payload: SignUpRequestDto) {
    return this.userAccountService.signUp(payload);
  }
  @MessagePattern(SIGNIN)
  signIn(@Payload() payload: SignInRequestDto) {
    return this.userAccountService.signIn(payload);
  }
  @MessagePattern(CHANGE_PASSWORD)
  changePassword(@Payload() payload: ChangePasswordRequestDto) {
    return this.userAccountService.changePassword(payload);
  }
  @MessagePattern(VERIFY_TOKEN)
  verifyToken(@Payload() payload: { token: string }) {
    return this.userAccountService.verifyToken(payload);
  }
  @MessagePattern(UPDATE_PROFILE)
  updateUser(@Payload() payload: UpdateProfileRequestDto) {
    return this.userAccountService.updateUser(payload?.id, payload);
  }
}
