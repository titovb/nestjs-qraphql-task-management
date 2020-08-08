import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common';
import {isMongoId} from 'class-validator';

export class IsMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isMongoId(value)) throw new BadRequestException(`'${metadata.data}' should be a mongoid`);
    return value;
  }
}
