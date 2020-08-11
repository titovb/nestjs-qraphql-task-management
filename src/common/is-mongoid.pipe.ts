import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common';
import {isMongoId} from 'class-validator';
import {ObjectId} from 'mongodb';

export class IsMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): ObjectId {
    if (!isMongoId(value)) throw new BadRequestException(`'${metadata.data}' should be a mongoid`);
    return new ObjectId(value);
  }
}
