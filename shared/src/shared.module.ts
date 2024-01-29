import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongo.config';
import { SchemaProvider } from './schemas';
import { repositories } from './repositories/repository.provider';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature(SchemaProvider),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class SharedModule { }
