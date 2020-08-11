import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';

@InputType()
export class TaskCreateInput {
  @Field()
  @IsNotEmptyString()
  name: string;

  @Field({nullable: true})
  @IsNotEmptyString()
  description?: string;
}
