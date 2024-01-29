import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from './user.schema';
import { Movie } from './movie.schema';
import { AbstractSchema } from '../abstract/abstract.schema';
@Schema({
  versionKey: false,
  timestamps: true,
})
export class Rating extends AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Movie.name, required: true })
  movieId: string;

  @Prop({ type: Number, required: true })
  rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
