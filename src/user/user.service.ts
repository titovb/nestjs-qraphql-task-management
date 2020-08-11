import {Injectable} from '@nestjs/common';
import {User} from './user';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {BaseService} from '../common/base.service';
import {Constants} from '../common/constants';
import {ObjectId} from 'mongodb';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(Constants.UserRef) userModel: Model<User>) {
    super(userModel);
  }

  public async getOneByIdOrFail(id: ObjectId): Promise<User> {
    return super.getOneOrFail({_id: id});
  }

  public async getOneById(id: ObjectId): Promise<User> {
    return super.getOne({_id: id});
  }

  public getOneByEmail(email: string): Promise<User> {
    return super.getOne({email});
  }

  public create(user: User): Promise<User> {
    return super.createOne(user);
  }

  public async getByIds(ids: ObjectId[]): Promise<User[]> {
    return super.getMany({_id: {$in: ids}});
  }
}
