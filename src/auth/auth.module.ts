import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {AuthService} from './auth.service';
import {JwtStrategy} from './jwt.strategy';
import {UserModule} from '../user/user.module';
import {AuthResolver} from './auth.resolver';
import {ProjectModule} from '../project/project.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_SECRET'),
        signOptions: {expiresIn: config.get<string>('ACCESS_EXPIRES_IN')}
      }),
      inject: [ConfigService]
    }),
    UserModule,
    ProjectModule
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy
  ]
})
export class AuthModule {
}
