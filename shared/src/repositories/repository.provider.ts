import { CategoryRepository } from './category.repository';
import { MovieRepository } from './movie.repository';
import { RatingRepository } from './rating.repository';
import { UserRepository } from './user.repository';

export const repositories = [
  UserRepository,
  CategoryRepository,
  MovieRepository,
  RatingRepository,
];
