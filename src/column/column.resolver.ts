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
import {UserService} from '../user/user.service';
import {TaskService} from '../task/task.service';
import {Task} from '../task/task';

@Resolver(() => Column)
@UseGuards(JwtGuard)
@UseInterceptors(ProjectParticipantInterceptor)
export class ColumnResolver {
  constructor(private readonly columnService: ColumnService,
              private readonly projectService: ProjectService,
              private readonly taskService: TaskService,
              private readonly userService: UserService) {
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

  @ResolveField('createdBy', () => User)
  getCreatedBy(@Parent() column: Column): Promise<User> {
    return this.userService.getOneById(column.createdBy);
  }

  @ResolveField('updatedBy', () => User)
  getUpdatedBy(@Parent() column: Column): Promise<User> {
    return this.userService.getOneById(column.updatedBy);
  }

  @ResolveField('tasks', () => [Task], {nullable: 'items'})
  getTasks(@Parent() column: Column): Promise<Task[]> {
    return this.taskService.getByColumnId(column._id);
  }
}
