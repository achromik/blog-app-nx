import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ValidateObjectID implements PipeTransform<string> {
  async transform(value: string, _metadata: ArgumentMetadata) {
    const isValid = mongoose.isValidObjectId(value);

    if (!isValid) {
      throw new BadRequestException('Invalid ID!');
    }
    return value;
  }
}
