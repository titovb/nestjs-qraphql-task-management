import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {GraphQLModule} from '@nestjs/graphql';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {ProjectModule} from './project/project.module';
import {ColumnModule} from './column/column.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get('DB_URI'),
        useNewUrlParser: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return ({
          context: ({req}) => ({req}),
          autoSchemaFile: config.get('GQL_SCHEMA_PATH'),
          debug: config.get('GQL_DEBUG') === 'true',
        });
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    ColumnModule,
  ],
})
export class AppModule {
}
