import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Project} from './project';
import {Model} from 'mongoose';
import {ProjectCreateInput} from './dto/project-create.input';
import {ProjectUpdateInput} from './dto/project-update.input';
import {UserService} from '../user/user.service';
import {BaseService} from '../common/base.service';
import {Constants} from '../common/constants';
import {ObjectId} from 'mongodb';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(@InjectModel(Constants.ProjectRef) projectModel: Model<Project>,
              private readonly userService: UserService) {
    super(projectModel);
  }

  public create(userId: ObjectId, dto: ProjectCreateInput): Promise<Project> {
    return super.createOne({
      ...dto,
      createdBy: userId,
      updatedBy: userId,
      participants: [userId]
    } as Project);
  }

  public update(userId: ObjectId, dto: ProjectUpdateInput): Promise<Project> {
    return super.updateOne(
      {_id: dto._id, participants: userId},
      {$set: {...dto, updatedBy: userId}}
    );
  }

  public async getByIdAndParticipantOrFail(userId: ObjectId, id: ObjectId): Promise<Project> {
    return super.getOneOrFail({_id: id, participants: userId});
  }

  public async delete(userId: ObjectId, id: ObjectId): Promise<Project> {
    return super.deleteOne({_id: id, createdBy: userId});
  }

  public getByParticipant(userId: ObjectId): Promise<Project[]> {
    return super.getMany({participants: userId});
  }

  public async addParticipant(userId: ObjectId, id: ObjectId, participantId: ObjectId): Promise<Project> {
    await this.userService.getOneByIdOrFail(participantId);
    return super.updateOne(
      {_id: id, createdBy: userId},
      {$addToSet: {participants: participantId}, $set: {updatedBy: userId}}
    );
  }

  public async removeParticipant(userId: ObjectId, id: ObjectId, participantId: ObjectId): Promise<Project> {
    if (userId.equals(participantId)) throw new BadRequestException(`Owner can't be removed from project`);
    return super.updateOne(
      {_id: id, createdBy: userId},
      {$pull: {participants: participantId}, $set: {updatedBy: userId}}
    );
  }

  public async getById(id: ObjectId): Promise<Project> {
    return this.getOne({_id: id});
  }

  public async getByIdAndParticipant(id: ObjectId, participantId: ObjectId): Promise<Project> {
    return super.getOne({_id: id, participants: participantId});
  }
}
