import {Field, InputType} from '@nestjs/graphql';
import {IsMongoId} from 'class-validator';

@InputType()
export class ParticipantInput {
  @Field()
  @IsMongoId()
  projectId: string;

  @Field()
  @IsMongoId()
  userId: string;
}
