import {
    Controller,
    Get,
    Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SERVICES } from '@shared/constants';
@Controller('UserAccount')
@ApiTags('user Account')
export class UserAccountController {
    constructor(
        @Inject(SERVICES.USER_ACCOUNT) private readonly userAccountServiceClient: ClientProxy
    ) { }
    @Get()
    getData() {
        return {
            success: "success"
        };
    }
}
