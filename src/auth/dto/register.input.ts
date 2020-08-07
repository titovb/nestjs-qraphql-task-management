import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmptyString} from '../../common/is-not-empty-string.validator';
import {LoginInput} from './login.input';

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  @IsNotEmptyString()
  name: string;
}
