import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { RMQ_MESSAGES, SERVICES } from '@shared';
import { firstValueFrom } from 'rxjs';
@Controller('movies')
@ApiTags('Movies')
export class MoviesController {
  constructor(
    @Inject(SERVICES.MOVIES) private readonly moviesServiceClient: ClientProxy
  ) {}

  @Get()
  getData() {
    return {
      success: 'success',
    };
  }

  // @Auth(true)
  @Get('API_ENDPOINTS.AIR_SERVICES.CONTRACT.GET_CONTRACTS')
  // @ApiOkResponse({ type: GetContractsResponseDto })
  public async getContracts(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.moviesServiceClient.send('test', {})
      );
      return response;
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
