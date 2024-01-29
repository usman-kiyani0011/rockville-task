import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
import { MoviesController } from './controllers/movies.controllers';
@Module({
  imports: [SharedModule],
  controllers: [MoviesController],
  providers: [],
})
export class MoviesModule {}
