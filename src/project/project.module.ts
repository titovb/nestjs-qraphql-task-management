import {Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Project, ProjectSchema} from './project';
import {ProjectResolver} from './project.resolver';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}]),
    UserModule
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {
}
