import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Project} from './project';
import {UseGuards} from '@nestjs/common';
import {JwtGuard} from '../auth/jwt.guard';
import {ProjectService} from './project.service';
import {CurrentUser} from '../auth/current-user.decorator';
import {User} from '../user/user';
import {ProjectCreateInput} from './dto/project-create.input';
import {ProjectUpdateInput} from './dto/project-update.input';
import {IsMongoIdPipe} from '../common/is-mongoid.pipe';
import {UserService} from '../user/user.service';
import {ParticipantInput} from './dto/participant.input';

@Resolver(() => Project)
@UseGuards(JwtGuard)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService,
              private readonly userService: UserService) {
  }

  @Mutation(() => Project, {name: 'createProject'})
  create(@CurrentUser() user: User,
         @Args('project') dto: ProjectCreateInput): Promise<Project> {
    return this.projectService.create(user._id.toString(), dto);
  }

  @Mutation(() => Project, {name: 'updateProject'})
  update(@CurrentUser() user: User,
         @Args('project') dto: ProjectUpdateInput): Promise<Project> {
    return this.projectService.update(user._id.toString(), dto);
  }

  @Mutation(() => Project, {name: 'deleteProject'})
  delete(@CurrentUser() user: User,
         @Args('id', IsMongoIdPipe) id: string): Promise<Project> {
    return this.projectService.delete(user._id.toString(), id);
  }

  @Query(() => Project, {name: 'getProjectById'})
  getById(@CurrentUser() user: User,
          @Args('id', IsMongoIdPipe) id: string): Promise<Project> {
    return this.projectService.getById(user._id.toString(), id);
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

  @Mutation(() => Project, {name: 'addProjectParticipant'})
  addParticipant(@Args('participantData') participantInput: ParticipantInput,
                 @CurrentUser() user: User): Promise<Project> {
    return this.projectService.addParticipant(user._id.toString(), participantInput.projectId, participantInput.userId);
  }

  @Mutation(() => Project, {name: 'removeProjectParticipant'})
  removeParticipant(@Args('participantData') participantInput: ParticipantInput,
                    @CurrentUser() user: User): Promise<Project> {
    return this.projectService.removeParticipant(user._id.toString(), participantInput.projectId, participantInput.userId);
  }
}
