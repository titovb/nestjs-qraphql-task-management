import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Constants} from '../common/constants';
import {Document, Types} from 'mongoose';
import {User} from '../user/user';
import {Column} from '../column/column';

@ObjectType()
@Schema({collection: Constants.TaskRef, id: false, timestamps: true})
export class Task extends Document {
  @Field(() => ID)
  _id: any;

  @Field()
  @Prop({required: true})
  name: string;

  @Field({nullable: true})
  @Prop()
  description?: string;

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

  @Field(() => Column)
  @Prop({type: Types.ObjectId, ref: Constants.ColumnRef, required: true, index: true})
  column: any;

  @Field(() => User, {nullable: true})
  @Prop({type: Types.ObjectId, ref: Constants.UserRef, index: true})
  assignee?: any;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
