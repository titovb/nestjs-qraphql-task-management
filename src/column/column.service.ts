import {Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {Column} from './column';
import {InjectModel} from '@nestjs/mongoose';
import {ColumnCreateInput} from './dto/column-create.input';
import {ColumnUpdateInput} from './dto/column-update.input';
import {BaseService} from '../common/base.service';
import {Constants} from '../common/constants';
import {ObjectId} from 'mongodb';

@Injectable()
export class ColumnService extends BaseService<Column> {
  constructor(@InjectModel(Constants.ColumnRef) columnModel: Model<Column>) {
    super(columnModel);
  }

  public create(userId: ObjectId, projectId: ObjectId, dto: ColumnCreateInput): Promise<Column> {
    return super.createOne({...dto, project: projectId, createdBy: userId, updatedBy: userId} as Column);
  }

  public update(userId: ObjectId, projectId: ObjectId, dto: ColumnUpdateInput): Promise<Column> {
    return super.updateOne(
      {_id: dto._id, project: projectId},
      {$set: {...dto, updatedBy: userId}}
    );
  }

  public getByProject(projectId: ObjectId): Promise<Column[]> {
    return super.getMany({project: projectId});
  }

  public delete(projectId: ObjectId, id: ObjectId): Promise<Column> {
    return super.deleteOne({project: projectId, _id: id});
  }

  public getOneByIdAndProjectOrFail(id: ObjectId, projectId: ObjectId): Promise<Column> {
    return super.getOneOrFail({_id: id, project: projectId});
  }

  public getOneById(id: ObjectId): Promise<Column> {
    return super.getOne({_id: id});
  }
}
