import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../abstract/abstract.repository';
import { Rating } from '../schemas';

@Injectable()
export class RatingRepository extends AbstractRepository<Rating> {
  protected readonly logger = new Logger(RatingRepository.name);

  constructor(
    @InjectModel(Rating.name) ratingModel: Model<Rating>,
    @InjectConnection() connection: Connection
  ) {
    super(ratingModel, connection);
  }
}
