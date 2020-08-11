import {Field, ID, InputType, PartialType} from '@nestjs/graphql';
import {TaskCreateInput} from './task-create.input';
import {IsMongoId} from 'class-validator';
import {ObjectId} from 'mongodb';
import {Transform} from 'class-transformer';

@InputType()
export class TaskUpdateInput extends PartialType(TaskCreateInput) {
  @Field(() => ID)
  @IsMongoId()
  @Transform((val: string) => new ObjectId(val))
  _id: ObjectId;
}
