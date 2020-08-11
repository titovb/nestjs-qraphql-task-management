import {Args, ID, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Project} from './project';
import {UseGuards} from '@nestjs/common';
import {JwtGuard} from '../auth/jwt.guard';
import {CurrentUser} from '../auth/current-user.decorator';
import {User} from '../user/user';
import {ProjectCreateInput} from './dto/project-create.input';
import {ProjectUpdateInput} from './dto/project-update.input';
import {IsMongoIdPipe} from '../common/is-mongoid.pipe';
import {UserService} from '../user/user.service';
import {ProjectService} from './project.service';
import {Column} from '../column/column';
import {ColumnService} from '../column/column.service';
import {ObjectId} from 'mongodb';

@Resolver(() => Project)
@UseGuards(JwtGuard)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService,
              private readonly userService: UserService,
              private readonly columnService: ColumnService) {
  }

  @Query(() => Project, {name: 'getProjectById'})
  getById(@CurrentUser() user: User,
          @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Project> {
    return this.projectService.getByIdAndParticipantOrFail(user._id.toString(), id);
  }

  @Mutation(() => Project, {name: 'createProject'})
  create(@CurrentUser() user: User,
         @Args('project') dto: ProjectCreateInput): Promise<Project> {
    return this.projectService.create(user._id, dto);
  }

  @Mutation(() => Project, {name: 'updateProject'})
  update(@CurrentUser() user: User,
         @Args('project') dto: ProjectUpdateInput): Promise<Project> {
    return this.projectService.update(user._id, dto);
  }

  @Mutation(() => Project, {name: 'deleteProject'})
  delete(@CurrentUser() user: User,
         @Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId): Promise<Project> {
    return this.projectService.delete(user._id, id);
  }

  @Mutation(() => Project, {name: 'addProjectParticipant'})
  addParticipant(@Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId,
                 @Args('participantId', {type: () => ID}, IsMongoIdPipe) participantId: ObjectId,
                 @CurrentUser() user: User): Promise<Project> {
    return this.projectService.addParticipant(user._id, id, participantId);
  }

  @Mutation(() => Project, {name: 'removeProjectParticipant'})
  removeParticipant(@Args('id', {type: () => ID}, IsMongoIdPipe) id: ObjectId,
                    @Args('participantId', {type: () => ID}, IsMongoIdPipe) participantId: ObjectId,
                    @CurrentUser() user: User): Promise<Project> {
    return this.projectService.removeParticipant(user._id, id, participantId);
  }

  @ResolveField('createdBy', () => User)
  getCreatedBy(@Parent() project: Project): Promise<User> {
    return this.userService.getOneById(project.createdBy);
  }

  @ResolveField('updatedBy', () => User)
  getUpdatedBy(@Parent() project: Project): Promise<User> {
    return this.userService.getOneById(project.updatedBy);
  }

  @ResolveField('participants', () => [User])
  getParticipants(@Parent() project: Project): Promise<User[]> {
    return this.userService.getByIds(project.participants);
  }

  @ResolveField('columns', () => [Column])
  getColumns(@Parent() project: Project): Promise<Column[]> {
    return this.columnService.getByProject(project._id);
  }
}
