import {
  Controller,
  Get,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { SERVICES } from '@shared/constants';
@Controller('movies')
@ApiTags('Movies')
export class MoviesController {
  constructor(
    @Inject(SERVICES.MOVIES) private readonly moviesServiceClient: ClientProxy
  ) { }
  @Get()
  getData() {
    return {
      success: "success"
    };
  }
}
