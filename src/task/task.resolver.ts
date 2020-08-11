import {Args, ID, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Task} from './task';
import {UseGuards, UseInterceptors} from '@nestjs/common';
import {JwtGuard} from '../auth/jwt.guard';
import {ProjectParticipantInterceptor} from '../project/project-participant.interceptor';
import {TaskService} from './task.service';
import {CurrentUser} from '../auth/current-user.decorator';
import {User} from '../user/user';
import {IsMongoIdPipe} from '../common/is-mongoid.pipe';
import {ObjectId} from 'mongodb';
import {TaskCreateInput} from './dto/task-create.input';
import {TaskUpdateInput} from './dto/task-update.input';
import {UserService} from '../user/user.service';
import {Column} from '../column/column';
import {ColumnService} from '../column/column.service';

@Resolver(() => Task)
@UseGuards(JwtGuard)
@UseInterceptors(ProjectParticipantInterceptor)
export class TaskResolver {
  constructor(private readonly taskService: TaskService,
              private readonly userService: UserService,
              private readonly columnService: ColumnService) {
  }

  @Query(() => Task, {name: 'getTaskByIdAndColumn'})
  getById(@Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
          @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
          @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Task> {
    return this.taskService.getOneByIdAndColumnOrFail(projectId, columnId, id);
  }

  @Mutation(() => Task, {name: 'createTask'})
  create(@CurrentUser() user: User,
         @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
         @Args('task') dto: TaskCreateInput): Promise<Task> {
    return this.taskService.create(user._id, projectId, columnId, dto);
  }

  @Mutation(() => Task, {name: 'updateTask'})
  update(@CurrentUser() user: User,
         @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
         @Args('task') dto: TaskUpdateInput): Promise<Task> {
    return this.taskService.update(user._id, projectId, columnId, dto);
  }

  @Mutation(() => Task, {name: 'deleteTask'})
  delete(@Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
         @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Task> {
    return this.taskService.delete(projectId, columnId, id);
  }

  @Mutation(() => Task, {name: 'taskAssign'})
  assign(@CurrentUser() user: User,
         @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
         @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
         @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId,
         @Args('assigneeId', {type: () => ID}, IsMongoIdPipe) assigneeId: ObjectId): Promise<Task> {
    return this.taskService.assign(user._id, projectId, columnId, id, assigneeId);
  }

  @Mutation(() => Task, {name: 'taskUnassign'})
  unassign(@CurrentUser() user: User,
           @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
           @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
           @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Task> {
    return this.taskService.unassign(user._id, projectId, columnId, id);
  }

  @Mutation(() => Task, {name: 'moveTask'})
  move(@CurrentUser() user: User,
       @Args('projectId', {type: () => ID}, IsMongoIdPipe) projectId: ObjectId,
       @Args('columnId', {type: () => ID}, IsMongoIdPipe) columnId: ObjectId,
       @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId,
       @Args('newColumnId', {type: () => ID}, IsMongoIdPipe) newColumnId: ObjectId): Promise<Task> {
    return this.taskService.move(user._id, projectId, columnId, id, newColumnId);
  }

  @ResolveField('createdBy', () => User)
  getCreatedBy(@Parent() task: Task): Promise<User> {
    return this.userService.getOneById(task.createdBy);
  }

  @ResolveField('updatedBy', () => User)
  getUpdatedBy(@Parent() task: Task): Promise<User> {
    return this.userService.getOneById(task.updatedBy);
  }

  @ResolveField('assignee', () => User, {nullable: true})
  getAssignee(@Parent() task: Task): Promise<User> {
    return this.userService.getOneById(task.assignee);
  }

  @ResolveField('column', () => Column)
  getColumn(@Parent() task: Task): Promise<Column> {
    return this.columnService.getOneById(task.column);
  }
}
