import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, MinLength} from 'class-validator';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmptyString()
  @MinLength(6)
  password: string;
}
