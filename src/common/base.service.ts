import {CreateQuery, Document, FilterQuery, Model, UpdateQuery} from 'mongoose';
import {NotFoundException} from '@nestjs/common';

export abstract class BaseService<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {
  }

  protected createOne(data: CreateQuery<T>): Promise<T> {
    return this.model.create(data);
  }

  protected async updateOne(condition: FilterQuery<T>, query: UpdateQuery<T>): Promise<T> {
    const updated = await this.model.findOneAndUpdate(condition, query, {new: true}).exec();
    if (!updated) throw new NotFoundException(`${this.model.modelName} was not found`);
    return updated;
  }

  protected getOne(condition: FilterQuery<T>): Promise<T> {
    return this.model.findOne(condition).exec();
  }

  protected async getOneOrFail(condition: FilterQuery<T>): Promise<T> {
    const found = await this.model.findOne(condition).exec();
    if (!found) throw new NotFoundException(`${this.model.modelName} was not found`);
    return found;
  }

  protected getMany(condition?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(condition).exec();
  }

  protected async deleteOne(condition: FilterQuery<T>): Promise<T> {
    const deleted = await this.model.findOneAndDelete(condition).exec();
    if (!deleted) throw new NotFoundException(`${this.model.modelName} was not found`);
    return deleted;
  }
}
