import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AbstractRepository } from '../abstract/abstract.repository';
import { Category } from '../schemas';

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectConnection() connection: Connection
  ) {
    super(categoryModel, connection);
  }
}
