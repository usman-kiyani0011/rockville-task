import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  API_ENDPOINTS,
  API_TAGS,
  AddRatingRequestDto,
  CONTROLLERS,
  MovieListRequestDto,
  RMQ_MESSAGES,
  SERVICES,
} from '@shared';
import { Auth } from '../../decorators/auth.decorator';
import { firstValueFrom } from 'rxjs';
const {
  MOVIES: { LIST, RECOMMENDED, ADD_RATINGS, SEED },
  CATEGORY: { CATEGORY_SEEDS, CATEGORY_LIST },
} = RMQ_MESSAGES;
@Controller(CONTROLLERS.MOVIES)
@ApiTags(API_TAGS.MOVIES)
@ApiBearerAuth()
export class MoviesController {
  constructor(
    @Inject(SERVICES.MOVIES) private readonly movieServiceClient: ClientProxy
  ) {}

  @Post(API_ENDPOINTS.MOVIES.SEED)
  async seedMovies() {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(SEED, {})
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Auth(true)
  @Get(API_ENDPOINTS.MOVIES.LIST)
  async listMovies(@Query() { categoryId, search }: MovieListRequestDto) {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(LIST, { categoryId, search })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Get(API_ENDPOINTS.MOVIES.RECOMMENDED)
  @Auth(true)
  async listRecommendedMovies(@Req() { user: { _id, categories } }) {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(RECOMMENDED, {
          userId: _id,
          categories,
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Post(API_ENDPOINTS.MOVIES.ADD_RATING)
  @Auth(true)
  async addRating(
    @Body() payload: AddRatingRequestDto,
    @Req() { user: { _id } }
  ) {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(ADD_RATINGS, {
          ...payload,
          userId: _id,
        })
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Post(API_ENDPOINTS.CATEGORY.SEEDS)
  async seedCategories() {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(CATEGORY_SEEDS, {})
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(API_ENDPOINTS.CATEGORY.LIST)
  @Auth(true)
  async listCategories() {
    try {
      const response = await firstValueFrom(
        this.movieServiceClient.send(CATEGORY_LIST, {})
      );
      return response;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
