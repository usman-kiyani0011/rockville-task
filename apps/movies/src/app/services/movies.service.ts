import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  AddRatingRequestDto,
  CategoryRepository,
  MODELS,
  MovieListRequestDto,
  MovieRepository,
  RatingRepository,
} from '@shared';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly ratingRepository: RatingRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly httpService: HttpService
  ) {}
  async seedMovies() {
    try {
      const categories = await this.categoryRepository.find(
        {},
        {},
        {
          sort: { createdAt: -1 },
          limit: 5,
          notFoundThrowError: false 
        }
      );
      // if (!categories.length)
      //   throw new Error(
      //     'No categories found. Please seed some categories first.'
      //   );
      const movies = await this.movieRepository.countDocuments({});
      if (movies > 10) throw new Error('Already Added some data');
      const categoriesIds = categories
        .map(({ genreId }) => {
          return genreId;
        })
        .join('|');

      const { data } = await firstValueFrom(
        this.httpService.get(
          // `${process.env.MOVIES_BASE_URL}?apiKey=${process.env.MOVIES_API_KEY}page=1`
          // 'http://www.omdbapi.com/?apiKey=d156b98&page=1'
          `${process.env.MOVIES_BASE_URL}/?apiKey=${process.env.MOVIES_API_KEY}&s=harry&type=movie`
        )
      );
      if (data?.Response === 'True') {
        return data;
      }
      throw new Error('Error while fetching data from movies API');

      // if (status === 200) {
      //   const moviesList = data.results.map((movie) => {
      //     const categoryId = categories.find(({ genreId }) =>
      //       movie.genre_ids.includes(genreId)
      //     )?._id;
      //     return {
      //       name: movie.title,
      //       categoryId,
      //       poster: movie.poster_path
      //         ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
      //         : null,
      //       description: movie.overview,
      //     };
      //   });
      //   const insert = await this.movieRepository.createMany(moviesList);
      //   return moviesList;
      // }
      // throw new Error('Error while fetching data from movies API');
    } catch (error) {
      throw new RpcException(error?.message ? error.message : error);
    }
  }
  async listMovies(payload: MovieListRequestDto) {
    const { categoryId, search } = payload;
    try {
      let filterQuery = {
        categoryId,
      };
      if (search) filterQuery['name'] = { $regex: new RegExp(search, 'i') };
      return this.movieRepository.find(filterQuery);
      // .populate('categoryId')
      // .sort({ avgRating: -1 })
      // .lean();
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async recommendedMovies(payload: { userId: string; categories: string[] }) {
    const { userId, categories } = payload;
    try {
      const movies = await this.movieRepository.aggregate([
        {
          $match: {
            categoryId: { $in: categories.map((c) => new Types.ObjectId(c)) },
          },
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
      await this.movieRepository.findByIdAndUpdate(
        { _id: payload.movieId },
        {
          avgRating: newAverage,
        }
      );
      return rating;
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async fetchCategories() {
    try {
      return this.categoryRepository.find({}, {}, { sort: { createdAt: -1 } });
    } catch (error) {
      throw new RpcException(error);
    }
  }
  async seedCategories() {
    try {
      const categories = await this.categoryRepository.countDocuments();
      if (categories > 10) throw new Error('Already added some data');
      const { status, data } = await firstValueFrom(
        this.httpService.get(
          `${process.env.MOVIES_BASE_URL}?apiKey=${process.env.MOVIES_API_KEY}`
        )
      );

      if (status === 200) {
        const upsert = data.genres.map(({ id, name }) => ({
          updateOne: {
            filter: {
              genreId: id,
            },
            update: { $set: { genreId: id, name: name } },
            upsert: true,
          },
        }));
        // await this.categoryRepository.bulkWrite(upsert);
        return data.genres;
      }
      throw new Error('Error while fetching data from movies API');
    } catch (error) {
      throw new RpcException(error?.message ? error.message : error);
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
