import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  InsertManyOptions,
  ProjectionType,
  PipelineStage,
  Callback,
  AggregateOptions,
  Expression,
  QueryOptions,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { AbstractSchema } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
  protected abstract readonly logger: Logger;
  private friendlyName: string;
  private singleName: string;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection
  ) {
    this.friendlyName = this.model.collection.name.replace(
      /[^a-zA-Z0-9]+(.)/g,
      (_, chr) => chr.toUpperCase()
    );
    let end: number;
    this.singleName = this.friendlyName.charAt(0).toUpperCase();
    if (this.friendlyName.slice(1).endsWith('ies')) {
      end = -3;
    } else if (this.friendlyName.slice(1).endsWith('es')) {
      end = -2;
    } else if (this.friendlyName.slice(1).endsWith('s')) {
      end = -1;
    }
    this.singleName += `${this.friendlyName
      .slice(1, end)
      .replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2')}${
      end == -3 ? 'y' : ''
    }`.toLowerCase();
  }

  async create(document: TDocument, options?: SaveOptions): Promise<TDocument> {
    try {
      const createdDocument = new this.model({
        ...(!document._id && { _id: new Types.ObjectId() }),
        ...document,
      });
      return (
        await createdDocument.save(options)
      ).toJSON() as unknown as TDocument;
    } catch (err: any) {
      if (err.message.includes('duplicate')) {
        throw new ConflictException(`${this.friendlyName} already exists.`);
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }

  async createMany(
    documents: Omit<TDocument, '_id'>[],
    options?: InsertManyOptions
  ): Promise<TDocument[]> {
    try {
      const insertedDocuments = await this.model.insertMany(documents, options);
      return insertedDocuments as unknown as TDocument[];
    } catch (err) {
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }
  async updateMany(
    filterQuery: FilterQuery<TDocument>,
    updates?: UpdateQuery<TDocument> | UpdateWithAggregationPipeline,
    options?: {}
  ): Promise<any> {
    return await Promise.resolve(
      this.model.updateMany(filterQuery, updates || {}, options || {})
    );
  }

  async delete(filterQuery?: FilterQuery<TDocument>): Promise<TDocument[]> {
    try {
      const deletedDocument = await this.model.deleteOne(filterQuery || {});
      if (deletedDocument.deletedCount === 0) {
        throw new NotFoundException(`${this.singleName} not found.`);
      }
      return deletedDocument as any;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }
  async deleteByQuery(filterQuery?: FilterQuery<TDocument>): Promise<any> {
    try {
      const deletedDocument = await this.model.findByIdAndDelete(
        filterQuery || {}
      );
      return deletedDocument;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Invalid ${this.singleName.toLowerCase()} data entered.`
      );
    }
  }
  async deleteMany(
    filterQuery: FilterQuery<TDocument>,
    ids: Array<string>,
    column: string = '_id'
  ): Promise<any> {
    try {
      filterQuery = filterQuery || {};
      const query = { ...filterQuery, [column]: { $in: ids } };
      const deletedDocument = await this.model.deleteMany(query);
      if (deletedDocument.deletedCount === 0) {
        this.logger.warn(
          `${this.singleName} not found with filterQuery`,
          filterQuery
        );
        throw new NotFoundException(`${this.singleName} not found.`);
      }
      return deletedDocument as any;
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException(
        `Error ${this.friendlyName.toLowerCase()}, ${err.message}.`
      );
    }
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filterQuery, {}).exec();
    if (!document) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery`,
        filterQuery
      );
      throw new NotFoundException(`${this.singleName} not found.`);
    }
    return document;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options: QueryOptions<TDocument> | { notFoundThrowError: boolean } = {
      notFoundThrowError: true,
    }
  ): Promise<TDocument> {
    const { notFoundThrowError, ...remainingOptions } = options;
    const document: any = await Promise.resolve(
      this.model
        .findOne(
          filterQuery,
          projection || {},
          remainingOptions || { lean: true }
        )
        .lean()
    );
    if (!document && notFoundThrowError) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery`,
        filterQuery
      );
      throw new NotFoundException(`${this.singleName} not found.`);
    }

    return document;
  }
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    notFoundThrowError: boolean = true
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document && notFoundThrowError) {
      this.logger.warn(
        `${this.singleName} not found with filterQuery:`,
        filterQuery
      );
      throw new NotFoundException(`${this.singleName} not found.`);
    }

    return document;
  }

  async findByIdAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ) {
    const document = await this.model.findByIdAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>
  ) {
    return await this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(
    filterQuery?: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>
  ) {
    return this.model
      .find(filterQuery || {}, projection || {}, options || { lean: true })
      .lean();
  }

  async countDocuments(filterQuery?: FilterQuery<TDocument>) {
    return await this.model.countDocuments(filterQuery).lean();
  }

  async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions) {
    return await this.model.aggregate(pipeline, options);
  }

  async paginate({
    filterQuery,
    offset = 1,
    limit = 10,
    returnKey,
    pipelines = [],
    metadata = true,
  }: {
    filterQuery?: FilterQuery<TDocument>;
    offset: number;
    limit: number;
    returnKey?: string;
    pipelines?: Array<any>;
    metadata?: boolean;
  }) {
    if (typeof offset !== 'number') {
      offset = Number(offset);
    }
    if (typeof limit !== 'number') {
      limit = Number(limit);
    }

    const [data] = await this.model.aggregate<any>([
      {
        $match: {
          ...filterQuery,
        },
      },
      ...pipelines,

      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          total: [
            {
              $sortByCount: '$tag',
            },
          ],
          data: [
            {
              $addFields: {
                _id: '$_id',
              },
            },
          ],
        },
      },
      {
        $unwind: '$total',
      },
      {
        $project: {
          collections: {
            $slice: [
              '$data',
              (offset - 1) * limit,
              {
                $ifNull: [limit, '$total.count'],
              },
            ],
          },
          total: '$total.count',
          page: {
            $ceil: { $literal: offset - 1 / limit },
          },
          pages: {
            $ceil: {
              $divide: ['$total.count', limit],
            },
          },
        },
      },
    ]);
    if (metadata) {
      return {
        [!returnKey
          ? `${this.friendlyName[0].toLowerCase() + this.friendlyName.slice(1)}`
          : returnKey]: (<any>data)?.collections || [],
        meta: {
          page: (<any>data)?.page || 0,
          pages: (<any>data)?.pages || 0,
          limit,
          total: (<any>data)?.total || 0,
        },
      };
    } else {
      return (<any>data)?.collections || [];
    }
  }

  async findOneWithoutException(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: {}
  ): Promise<TDocument> {
    const document = await this.model.findOne(
      filterQuery,
      projection || {},
      options || { lean: true }
    );

    return document;
  }
}
