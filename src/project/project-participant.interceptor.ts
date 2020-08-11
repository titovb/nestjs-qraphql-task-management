import {BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {isMongoId} from 'class-validator';
import {Observable} from 'rxjs';
import {GqlExecutionContext} from '@nestjs/graphql';
import {ProjectService} from './project.service';
import {ObjectId} from 'mongodb';

@Injectable()
export class ProjectParticipantInterceptor implements NestInterceptor {
  constructor(private readonly projectService: ProjectService) {
  }

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const gqlCtx = ctx.getContext();
    const gqlArgs = ctx.getArgs();
    const userId = gqlCtx.req.user._id;
    const projectId = gqlArgs.projectId;
    if (!isMongoId(projectId)) throw new BadRequestException('projectId should be a mongoid');
    await this.projectService.getByIdAndParticipantOrFail(userId, new ObjectId(projectId));
    return next.handle();
  }
}
