import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';

@InputType()
export class ColumnCreateInput {
  @Field()
  @IsNotEmptyString()
  name: string;
}
