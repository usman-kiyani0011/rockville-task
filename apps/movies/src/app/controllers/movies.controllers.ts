import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddRatingRequestDto, MovieListRequestDto, RMQ_MESSAGES } from '@shared';
import { MovieService } from '../services/movies.service';
const { LIST, RECOMMENDED, ADD_RATINGS, SEED } = RMQ_MESSAGES.MOVIES;

@Controller()
export class MoviesController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern(SEED)
  async seedMovie(@Payload() _payload: {}) {
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

  @MessagePattern(LIST)
  getCategories() {
    return this.movieService.fetchCategories();
  }
  @MessagePattern(SEED)
  seedCategories() {
    return this.movieService.seedCategories();
  }
}
