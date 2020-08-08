import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';
import {IsOptional} from 'class-validator';

@InputType()
export class ProjectCreateInput {
  @Field()
  @IsNotEmptyString()
  name: string;

  @Field({nullable: true})
  @IsNotEmptyString()
  @IsOptional()
  description?: string;
}
