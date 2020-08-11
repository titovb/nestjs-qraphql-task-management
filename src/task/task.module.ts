import {forwardRef, Module} from '@nestjs/common';
import {TaskService} from './task.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Constants} from '../common/constants';
import {TaskSchema} from './task';
import {UserModule} from '../user/user.module';
import {ProjectModule} from '../project/project.module';
import {ColumnModule} from '../column/column.module';
import {TaskResolver} from './task.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Constants.TaskRef, schema: TaskSchema}]),
    UserModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => ColumnModule)
  ],
  providers: [TaskResolver, TaskService],
  exports: [TaskService]
})
export class TaskModule {
}
