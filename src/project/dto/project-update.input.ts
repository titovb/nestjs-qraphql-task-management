import {Field, ID, InputType, PartialType} from '@nestjs/graphql';
import {IsMongoId} from 'class-validator';
import {ProjectCreateInput} from './project-create.input';
import {Transform} from 'class-transformer';
import {ObjectId} from 'mongodb';

@InputType()
export class ProjectUpdateInput extends PartialType(ProjectCreateInput) {
  @Field(() => ID)
  @IsMongoId()
  @Transform((val: string) => new ObjectId(val))
  _id: string;
}
