import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  API_ENDPOINTS,
  API_TAGS,
  CONTROLLERS,
  ChangePasswordRequestDto,
  SignInRequestDto,
  RMQ_MESSAGES,
  SERVICES,
  SignUpRequestDto,
  UpdateProfileRequestDto,
} from '@shared';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../decorators/auth.decorator';
const {
  AUTH: { SIGNUP, SIGNIN, CHANGE_PASSWORD },
  PROFILE: { UPDATE_PROFILE },
} = RMQ_MESSAGES.USER_ACCOUNT;
@Controller(CONTROLLERS.USER_ACCOUNT)
@ApiTags(API_TAGS.USER_ACCOUNT)
export class UserAccountController {
  constructor(
    @Inject(SERVICES.USER_ACCOUNT)
    private readonly userAccountServiceClient: ClientProxy
  ) {}

  @Post(API_ENDPOINTS.USER_ACCOUNT.SIGN_UP)
  async signUp(@Body() payload: SignUpRequestDto): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.userAccountServiceClient.send(SIGNUP, payload)
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Post(API_ENDPOINTS.USER_ACCOUNT.SIGN_IN)
  async signIn(@Body() payload: SignInRequestDto): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.userAccountServiceClient.send(SIGNIN, payload)
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Auth(true)
  @ApiBearerAuth()
  @Put(API_ENDPOINTS.USER_ACCOUNT.CHANGE_PASSWORD)
  async changePassword(
    @Body() payload: ChangePasswordRequestDto,
    @Req() { user }
  ): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.userAccountServiceClient.send(CHANGE_PASSWORD, {
          ...payload,
          userId: user?._id,
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Auth(true)
  @ApiBearerAuth()
  @Get(API_ENDPOINTS.PROFILE.GET)
  async getUser(@Req() { user }): Promise<any> {
    return user;
  }

  @Auth(true)
  @ApiBearerAuth()
  @Patch(API_ENDPOINTS.PROFILE.UPDATE)
  async updateProfile(
    @Body() payload: UpdateProfileRequestDto,
    @Req() { user }
  ): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.userAccountServiceClient.send(UPDATE_PROFILE, {
          ...payload,
          id: user?._id,
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
