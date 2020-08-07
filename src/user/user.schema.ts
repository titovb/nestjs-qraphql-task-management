import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Field, ID, ObjectType} from '@nestjs/graphql';

@ObjectType()
@Schema({id: false})
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
}

export const UserSchema = SchemaFactory.createForClass(User);
