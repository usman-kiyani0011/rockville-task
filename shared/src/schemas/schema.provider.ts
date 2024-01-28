import { MODELS } from '../constants/models';
import { User, UserSchema } from './user.schema';

export const SchemaProvider = [
  { name: User.name, schema: UserSchema, collection: MODELS.USERS },
];
