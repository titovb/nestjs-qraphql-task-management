import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Project} from '../project/project';
import {Constants} from '../common/constants';

@ObjectType()
@Schema({collection: Constants.User, id: false})
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({required: true})
  name: string;

  @Field()
  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password?: string;

  @Field(() => [Project], {nullable: 'items'})
  projects: Project[];
}

export const UserSchema = SchemaFactory.createForClass(User);
