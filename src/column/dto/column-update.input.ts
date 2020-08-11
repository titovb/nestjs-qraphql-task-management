import {Field, InputType, PartialType} from '@nestjs/graphql';
import {ColumnCreateInput} from './column-create.input';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';
import {Transform} from 'class-transformer';
import {ObjectId} from 'mongodb';

@InputType()
export class ColumnUpdateInput extends PartialType(ColumnCreateInput) {
  @Field()
  @IsNotEmptyString()
  @Transform((val: string) => new ObjectId(val))
  _id: string;
}
