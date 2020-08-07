import {Injectable, NotFoundException} from '@nestjs/common';
import {User} from './user.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
  }

  public async getOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User '${id}' not found`);
    return user;
  }

  public getOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email}).exec();
  }

  public create(user: User): Promise<User> {
    return this.userModel.create(user);
  }
}
