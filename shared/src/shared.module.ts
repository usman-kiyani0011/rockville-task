
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongo.config';
import { SchemaProvider } from './schemas';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            useClass: MongooseConfig,
        }),
        MongooseModule.forFeature(SchemaProvider),
    ],
    providers: [],
    exports: [
    ]
})
export class SharedModule { }
