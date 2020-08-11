import {forwardRef, Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ProjectSchema} from './project';
import {ProjectResolver} from './project.resolver';
import {UserModule} from '../user/user.module';
import {ColumnModule} from '../column/column.module';
import {Constants} from '../common/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Constants.ProjectRef, schema: ProjectSchema}]),
    UserModule,
    forwardRef(() => ColumnModule)
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {
}
