import { Module } from '@nestjs/common';
import { SharedModule } from '@shared';
@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [],
})
export class MoviesModule {}