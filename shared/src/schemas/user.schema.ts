import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { AbstractSchema } from '../abstract/abstract.schema';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends AbstractSchema {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false })
  address?: string;

  @Prop({ type: Date, required: false })
  dob?: string;

  @Prop({ type: [String], required: false })
  categories?: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
