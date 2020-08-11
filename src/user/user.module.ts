import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './user';
import {UserService} from './user.service';
import {Constants} from '../common/constants';

@Module({
  imports: [MongooseModule.forFeature([{name: Constants.UserRef, schema: UserSchema}])],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
