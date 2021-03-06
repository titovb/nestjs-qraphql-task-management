import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Constants} from '../common/constants';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Document, Types} from 'mongoose';
import {Project} from '../project/project';
import {User} from '../user/user';
import {Task} from '../task/task';

@ObjectType()
@Schema({collection: Constants.ColumnRef, timestamps: true})
export class Column extends Document {
  @Field(() => ID)
  _id: any;

  @Field()
  @Prop({required: true})
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  @Prop({type: Types.ObjectId, ref: Constants.UserRef, required: true, index: true})
  createdBy: any;

  @Field(() => User)
  @Prop({type: Types.ObjectId, ref: Constants.UserRef, required: true, index: true})
  updatedBy: any;

  @Field(() => Project)
  @Prop({type: Types.ObjectId, ref: Constants.ProjectRef, required: true, index: true})
  project: any;

  @Field(() => [Task], {nullable: 'items'})
  tasks?: Task[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
