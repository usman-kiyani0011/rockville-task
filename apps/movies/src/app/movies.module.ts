import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { MoviesController } from './controllers/movies.controllers';
import { HttpModule } from '@nestjs/axios';
import { MovieService } from './services/movies.service';
@Module({
  imports: [SharedModule, HttpModule],
  controllers: [MoviesController],
  providers: [MovieService],
})
export class MoviesModule {}
