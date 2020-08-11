import {Document, Types} from 'mongoose';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {User} from '../user/user';
import {Constants} from '../common/constants';
import {Column} from '../column/column';

@ObjectType()
@Schema({collection: Constants.ProjectRef, id: false, timestamps: true})
export class Project extends Document {
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

  @Field(() => [User])
  @Prop({type: [Types.ObjectId], ref: Constants.UserRef, required: true, index: true})
  participants: any[];

  @Field(() => [Column])
  columns: Column[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
