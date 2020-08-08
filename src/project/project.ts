import {Document, Types} from 'mongoose';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {User} from '../user/user';
import {Constants} from '../common/constants';

@ObjectType()
@Schema({collection: Constants.Project, id: false, timestamps: true})
export class Project extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({required: true})
  name: string;

  @Field({nullable: true})
  @Prop()
  description?: string;

  @Field(() => User)
  @Prop({type: Types.ObjectId, ref: Constants.User, required: true, index: true})
  createdBy: string;

  @Field(() => User)
  @Prop({type: Types.ObjectId, ref: Constants.User, required: true, index: true})
  updatedBy: string;

  @Field(() => [User])
  @Prop({type: [Types.ObjectId], ref: Constants.User, required: true, index: true})
  participants: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
