import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Project} from './project';
import {Model} from 'mongoose';
import {ProjectCreateInput} from './dto/project-create.input';
import {ProjectUpdateInput} from './dto/project-update.input';
import {UserService} from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>,
              private readonly userService: UserService) {
  }

  public create(userId: string, dto: ProjectCreateInput): Promise<Project> {
    return this.projectModel.create({
      ...dto,
      createdBy: userId,
      updatedBy: userId,
      participants: [userId]
    } as Project);
  }

  public async update(userId: string, dto: ProjectUpdateInput): Promise<Project> {
    const project = await this.projectModel.findOneAndUpdate(
      {_id: dto._id, participants: userId},
      {$set: {...dto, updatedBy: userId}},
      {new: true}
    );
    if (!project) throw new NotFoundException(`Project '${dto._id}' was not found`);
    return project;
  }

  public async getById(userId: string, id: string): Promise<Project> {
    const project = await this.projectModel.findOne({_id: id, participants: userId});
    if (!project) throw new NotFoundException(`Project '${id}' was not found`);
    return project;
  }

  public async delete(userId: string, id: string): Promise<Project> {
    const project = await this.projectModel.findOneAndDelete({_id: id, createdBy: userId});
    if (!project) throw new NotFoundException(`Project '${id}' was not found`);
    return project;
  }

  public getByParticipant(userId: string): Promise<Project[]> {
    return this.projectModel.find({participants: userId}).exec();
  }

  public async addParticipant(userId: string, id: string, participantId: string): Promise<Project> {
    await this.userService.getOneById(participantId);
    const project = await this.projectModel.findOneAndUpdate(
      {_id: id, createdBy: userId},
      {$addToSet: {participants: participantId}, $set: {updatedBy: userId}},
      {new: true}
    );
    if (!project) throw new NotFoundException(`Project '${id}' was not found`);
    return project;
  }

  public async removeParticipant(userId: string, id: string, participantId: string): Promise<Project> {
    if (userId === participantId) throw new BadRequestException(`Owner can't be removed from project`);
    const project = await this.projectModel.findOneAndUpdate(
      {_id: id, createdBy: userId},
      {$pull: {participants: participantId}, $set: {updatedBy: userId}},
      {new: true}
    );
    if (!project) throw new NotFoundException(`Project '${id}' was not found`);
    return project;
  }
}
