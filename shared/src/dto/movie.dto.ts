import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { toMongoObjectId } from '@shared';

export class MovieListRequestDto {
  @ApiProperty({ description: 'Category ID' })
  @IsMongoId()
  categoryId: string;
  @ApiProperty({ description: 'Search by title' })
  @IsOptional()
  search: string;
}
export class MovieDetailRequestDto {
  @ApiProperty({ description: 'Movie ID' })
  @IsMongoId()
  movieId: string;
}
export class MovieDetailQueryRequestDto {
  @ApiProperty({ description: 'User ID' })
  @IsMongoId()
  @IsOptional()
  userId: string;
}

export class AddRatingRequestDto {
  @ApiProperty({ description: 'Movie ID' })
  @Transform(toMongoObjectId)
  movieId: string;

  @ApiProperty({ description: 'Rating', example: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Transform(toMongoObjectId)
  userId: string;
}
