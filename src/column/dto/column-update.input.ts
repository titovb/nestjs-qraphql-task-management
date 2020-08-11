import {Field, InputType, PartialType} from '@nestjs/graphql';
import {ColumnCreateInput} from './column-create.input';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';

@InputType()
export class ColumnUpdateInput extends PartialType(ColumnCreateInput) {
  @Field()
  @IsNotEmptyString()
  _id: string;
}
