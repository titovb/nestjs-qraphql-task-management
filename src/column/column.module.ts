import {forwardRef, Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ColumnSchema} from './column';
import {ColumnService} from './column.service';
import {ColumnResolver} from './column.resolver';
import {ProjectModule} from '../project/project.module';
import {Constants} from '../common/constants';
import {UserModule} from '../user/user.module';
import {TaskModule} from '../task/task.module';

@Module({
   imports: [
     MongooseModule.forFeature([{name: Constants.ColumnRef, schema: ColumnSchema}]),
     UserModule,
     forwardRef(() => ProjectModule),
     forwardRef(() => TaskModule)
   ],
   providers: [
     ColumnService,
     ColumnResolver
   ],
    exports: [ColumnService]
 })
 export class ColumnModule {
 }
