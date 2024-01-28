import { BadRequestException } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';

export function toMongoObjectId({
  value,
  key,
}): Types.ObjectId | Types.ObjectId[] {
  if (!value) {
    return;
  } else if (isValidObjectId(value)) {
    return new Types.ObjectId(value);
  } else if (typeof value === 'string' && value.includes(',')) {
    const ids = value.split(',');

    const response: Types.ObjectId[] = [];
    for (const val of ids) {
      if (isValidObjectId(val)) {
        response.push(new Types.ObjectId(val));
      } else {
        throw new BadRequestException(
          `${val} of ${key} is not a valid MongoId`
        );
      }
    }
    return response;
  } else if (Array.isArray(value)) {
    const response: Types.ObjectId[] = [];
    for (const val of value) {
      if (isValidObjectId(val)) {
        response.push(new Types.ObjectId(val));
      } else {
        throw new BadRequestException(
          `${val} of ${key} is not a valid MongoId`
        );
      }
    }
    return response;
  } else {
    throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}
