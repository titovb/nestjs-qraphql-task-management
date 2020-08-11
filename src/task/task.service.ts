import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Constants} from '../common/constants';
import {Task} from './task';
import {Model} from 'mongoose';
import {BaseService} from '../common/base.service';
import {ObjectId} from 'mongodb';
import {TaskCreateInput} from './dto/task-create.input';
import {ColumnService} from '../column/column.service';
import {TaskUpdateInput} from './dto/task-update.input';
import {ProjectService} from '../project/project.service';

@Injectable()
export class TaskService extends BaseService<Task> {
  constructor(@InjectModel(Constants.TaskRef) taskModel: Model<Task>,
              private readonly columnService: ColumnService,
              private readonly projectService: ProjectService) {
    super(taskModel);
  }

  async create(userId: ObjectId, projectId: ObjectId, columnId: ObjectId, dto: TaskCreateInput): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.createOne({...dto, createdBy: userId, updatedBy: userId, column: columnId} as Task)
  }

  async update(userId: ObjectId, projectId: ObjectId, columnId: ObjectId, dto: TaskUpdateInput): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.updateOne(
      {_id: dto._id, column: columnId},
      {$set: {...dto, updatedBy: userId}}
    );
  }

  async delete(projectId: ObjectId, columnId: ObjectId, id: ObjectId): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.deleteOne({_id: id, column: columnId});
  }

  async getOneByIdAndColumnOrFail(projectId: ObjectId, columnId: ObjectId, id: ObjectId): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.getOneOrFail({_id: id, column: columnId});
  }

  async assign(userId: ObjectId, projectId: ObjectId, columnId: ObjectId, id: ObjectId, assigneeId: ObjectId): Promise<Task> {
    const project = await this.projectService.getByIdAndParticipant(projectId, assigneeId);
    if (!project) throw new BadRequestException(`User '${assigneeId}' is not a participant of project '${projectId}'`);
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.updateOne(
      {_id: id, column: columnId},
      {$set: {assignee: assigneeId, updatedBy: userId}}
    );
  }

  async unassign(userId: ObjectId, projectId: ObjectId, columnId: ObjectId, id: ObjectId): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    return super.updateOne(
      {_id: id, column: columnId},
      {$set: {assignee: null, updatedBy: userId}}
    );
  }

  async move(userId: ObjectId, projectId: ObjectId, columnId: ObjectId, id: ObjectId, newColumnId: ObjectId): Promise<Task> {
    await this.columnService.getOneByIdAndProjectOrFail(columnId, projectId);
    await this.columnService.getOneByIdAndProjectOrFail(newColumnId, projectId);
    return super.updateOne(
      {_id: id, column: columnId},
      {$set: {column: newColumnId, updatedBy: userId}}
    );
  }

  getByColumnId(columnId: ObjectId): Promise<Task[]> {
    return super.getMany({column: columnId});
  }
}
