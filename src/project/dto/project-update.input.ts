import {Field, ID, InputType, PartialType} from '@nestjs/graphql';
import {IsMongoId} from 'class-validator';
import {ProjectCreateInput} from './project-create.input';

@InputType()
export class ProjectUpdateInput extends PartialType(ProjectCreateInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: string;
}
