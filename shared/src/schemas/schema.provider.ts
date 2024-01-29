import { MODELS } from '../constants/models';
import { Category, CategorySchema } from './category.schema';
import { Movie, MovieSchema } from './movie.schema';
import { Rating, RatingSchema } from './rating.schema';
import { User, UserSchema } from './user.schema';

export const SchemaProvider = [
  { name: User.name, schema: UserSchema, collection: MODELS.USERS },
  { name: Movie.name, schema: MovieSchema, collection: MODELS.MOVIES },
  {
    name: Category.name,
    schema: CategorySchema,
    collection: MODELS.CATEGORIES,
  },
  { name: Rating.name, schema: RatingSchema, collection: MODELS.RATINGS },
];
