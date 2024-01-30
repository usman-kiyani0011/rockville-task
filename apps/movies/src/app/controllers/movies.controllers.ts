import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AddRatingRequestDto,
  MovieListRequestDto,
  RMQ_MESSAGES,
} from '@shared';
import { MovieService } from '../services/movies.service';
const {
  MOVIES: { LIST, RECOMMENDED, ADD_RATINGS, SEED },
  CATEGORY: { CATEGORY_SEEDS },
} = RMQ_MESSAGES;

@Controller()
export class MoviesController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern(SEED)
  async seedMovies(@Payload() _payload: {}) {
    return this.movieService.seedMovies();
  }

  @MessagePattern(LIST)
  async listMovies(@Payload() payload: MovieListRequestDto) {
    return this.movieService.listMovies(payload);
  }
  @MessagePattern(RECOMMENDED)
  async recommendedMovies(
    @Payload() payload: { userId: string; categories: string[] }
  ) {
    return this.movieService.recommendedMovies(payload);
  }
  @MessagePattern(ADD_RATINGS)
  async addRating(@Payload() payload: AddRatingRequestDto) {
    return this.movieService.addRating(payload);
  }

  @MessagePattern(CATEGORY_SEEDS)
  seedCategories() {
    return this.movieService.seedCategories();
  }
}
