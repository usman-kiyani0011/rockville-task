import { ConflictException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import {
  AddRatingRequestDto,
  CategoryRepository,
  MODELS,
  MovieListRequestDto,
  MovieRepository,
  RatingRepository,
  UserRepository,
} from '@shared';
import { join } from 'path';
import { readFile } from 'fs/promises';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly ratingRepository: RatingRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository
  ) {}
  async seedMovies() {
    try {
      const categories = await this.categoryRepository.find(
        {},
        {},
        {
          sort: { createdAt: -1 },
          notFoundThrowError: false,
        }
      );
      if (!categories?.length) throw new Error('Enter categories first');
      const filePath = join(process.cwd(), 'movies-dataset.json');
      const fileData = await readFile(filePath, 'utf8');
      const moviesDataSet = JSON.parse(fileData);
      const movies = await this.movieRepository.countDocuments({});
      if (movies > 1) throw new Error('Already added some data');
      const moviesList = moviesDataSet?.map((movie) => {
        const categoryId = categories.find(({ _id, name }) =>
          movie.genres.includes(name)
        )?._id;
        return {
          name: movie?.title,
          categoryId: categoryId?.toString(),
          poster: movie.thumbnail,
          description: movie.extract,
        };
      });

      await this.movieRepository.createMany(moviesList);

      return moviesList;
    } catch (error) {
      throw new RpcException(error?.message ? error.message : error);
    }
  }
  async listMovies(payload: MovieListRequestDto) {
    try {
      const { categoryId, search } = payload;
      let filterQuery = {
        ...(categoryId && { categoryId }),
      };

      if (search) filterQuery['name'] = { $regex: new RegExp(search, 'i') };
      return this.movieRepository.find(
        filterQuery,
        {},
        { populate: 'categoryId' }
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async recommendedMovies(payload: { userId: string; categories: string[] }) {
    const { userId, categories } = payload;
    try {
      let matchCategories: any = {};
      if (categories?.length)
        matchCategories = {
          $or: [
            {
              categoryId: {
                $in: categories.map((c) => new Types.ObjectId(c)),
              },
            },
          ],
        };
      const movies = await this.movieRepository.aggregate([
        {
          $match: matchCategories,
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryId',
          },
        },
        {
          $lookup: {
            from: 'ratings',
            localField: '_id',
            foreignField: 'movieId',
            as: 'ratings',
          },
        },
        {
          $match: {
            'ratings.userId': { $ne: new Types.ObjectId(userId) },
          },
        },
        {
          $sort: {
            avgRating: -1,
          },
        },
        {
          $project: {
            ratings: 0,
          },
        },
      ]);
      return movies;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async addRating(payload: AddRatingRequestDto) {
    try {
      const [movieRating] = await this.movieRepository.aggregate([
        { $match: { _id: payload.movieId } },
        {
          $lookup: {
            from: MODELS.RATINGS,
            localField: '_id',
            foreignField: 'movieId',
            as: 'ratings',
          },
        },
        {
          $project: {
            ratingCount: { $size: '$ratings' },
            avgRating: 1,
          },
        },
      ]);
      if (!movieRating) throw new Error('No movie found with this id ');
      const rating = await this.ratingRepository.create(payload);
      const newAverage = this.calculateAverage(
        movieRating.avgRating,
        movieRating.ratingCount,
        payload.rating
      );
      const movie = await this.movieRepository.findByIdAndUpdate(
        { _id: payload.movieId },
        {
          avgRating: newAverage,
        }
      );
      await this.userRepository.findOneAndUpdate(
        { _id: payload?.userId, categories: { $nin: [movie?.categoryId] } },
        {
          $addToSet: {
            categories: movie?.categoryId,
          },
        },
        false
      );

      return rating;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async seedCategories() {
    try {
      const categories = await this.categoryRepository.countDocuments();
      if (categories > 0) throw new Error('Already added some data');

      const categoriesData = [
        { name: 'Action' },
        { name: 'Horror' },
        { name: 'Comedy' },
        { name: 'Drama' },
        { name: 'Crime' },
        { name: 'Mystery' },
        { name: 'Adventure' },
        { name: 'Thriller' },
      ];
      return await this.categoryRepository.createMany(categoriesData);
    } catch (error) {
      throw new RpcException(error?.message ? error.message : error);
    }
  }
  async listCategories() {
    try {
      return this.categoryRepository.find({}, {}, { sort: { createdAt: -1 } });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  private calculateAverage(
    oldAverage: number = 0,
    oldCount: number = 0,
    newRating: number
  ) {
    const newCount = oldCount + 1;
    const newAverage = (oldAverage * oldCount + newRating) / newCount;
    return newAverage.toFixed(1);
  }
}
