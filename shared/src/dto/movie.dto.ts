import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toMongoObjectId } from '@shared';

export class MovieListRequestDto {
  @ApiProperty({ description: 'Category ID', required: false })
  @IsOptional()
  @Transform(toMongoObjectId)
  categoryId: string;

  @ApiProperty({ description: 'Search by movie title', required: false })
  @IsOptional()
  search: string;
}

export class AddRatingRequestDto {
  @ApiProperty({ description: 'Movie ID', example: '65b8e79661af07e0d23976d6' })
  @Transform(toMongoObjectId)
  @IsOptional()
  movieId: string;

  @ApiProperty({ description: 'Rating', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Transform(toMongoObjectId)
  userId: string;
}
