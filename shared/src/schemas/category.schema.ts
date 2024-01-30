import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { AbstractSchema } from '../abstract/abstract.schema';
@Schema({
  versionKey: false,
  timestamps: true,
})
export class Category extends AbstractSchema {
  @Prop({ type: String, required: true })
  name: string;

}
export const CategorySchema = SchemaFactory.createForClass(Category);
