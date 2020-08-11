import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {ConfigService} from '@nestjs/config';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthService} from './auth.service';
import {User} from '../user/user';
import {isMongoId} from 'class-validator';
import {ObjectId} from 'mongodb';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(private readonly config: ConfigService,
              private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_SECRET'),
    });
  }

  public validate(payload: any): Promise<User> {
    const id = payload.sub;
    if (!id && !isMongoId(id)) throw new UnauthorizedException();
    return this.authService.validateUser(new ObjectId(id));
  }
}
