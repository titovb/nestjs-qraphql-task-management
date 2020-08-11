import {Args, ID, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {Column} from './column';
import {UseGuards, UseInterceptors} from '@nestjs/common';
import {ProjectParticipantInterceptor} from '../project/project-participant.interceptor';
import {JwtGuard} from '../auth/jwt.guard';
import {ColumnService} from './column.service';
import {CurrentUser} from '../auth/current-user.decorator';
import {User} from '../user/user';
import {IsMongoIdPipe} from '../common/is-mongoid.pipe';
import {ColumnCreateInput} from './dto/column-create.input';
import {ColumnUpdateInput} from './dto/column-update.input';
import {ProjectService} from '../project/project.service';
import {Project} from '../project/project';
import {ObjectId} from 'mongodb';

@Resolver(() => Column)
@UseGuards(JwtGuard)
@UseInterceptors(ProjectParticipantInterceptor)
export class ColumnResolver {
  constructor(private readonly columnService: ColumnService,
              private readonly projectService: ProjectService) {
  }

  @Mutation(() => Column, {name: 'createColumn'})
  create(@CurrentUser() user: User,
         @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('column') dto: ColumnCreateInput): Promise<Column> {
    return this.columnService.create(user._id, projectId, dto);
  }

  @Mutation(() => Column, {name: 'updateColumn'})
  update(@CurrentUser() user: User,
         @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('column') dto: ColumnUpdateInput): Promise<Column> {
    return this.columnService.update(user._id, projectId, dto);
  }

  @Mutation(() => Column, {name: 'deleteColumn'})
  delete(@Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Column> {
    return this.columnService.delete(projectId, id);
  }

  @ResolveField('project', () => Project)
  getProject(@Parent() column: Column): Promise<Project> {
    return this.projectService.getById(column.project);
  }
}
