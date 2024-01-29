import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Category } from './category.schema';
import { AbstractSchema } from '../abstract/abstract.schema';
@Schema({
  versionKey: false,
  timestamps: true,
})
export class Movie extends AbstractSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  poster?: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Category.name,
    required: true,
  })
  categoryId!: string;

  @Prop({ type: Number, required: false, default: 0 })
  avgRating?: number;
}
export const MovieSchema = SchemaFactory.createForClass(Movie);
