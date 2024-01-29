import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../abstract/abstract.repository';
import { Movie } from '../schemas';

@Injectable()
export class MovieRepository extends AbstractRepository<Movie> {
  protected readonly logger = new Logger(MovieRepository.name);

  constructor(
    @InjectModel(Movie.name) movieModel: Model<Movie>,
    @InjectConnection() connection: Connection
  ) {
    super(movieModel, connection);
  }
}
