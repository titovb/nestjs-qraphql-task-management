import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {User} from '../user/user.schema';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UserService} from '../user/user.service';
import {RegisterInput} from './dto/register.input';
import {LoginInput} from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService) {
  }

  public async register(dto: RegisterInput): Promise<User> {
    const user = await this.userService.getOneByEmail(dto.email);
    if (user) throw new BadRequestException(`User with email '${dto.email}' already exists`);
    dto.password = await this.encodePassword(dto.password);
    return this.userService.create(dto as User);
  }

  public async login(dto: LoginInput): Promise<string> {
    const user = await this.userService.getOneByEmail(dto.email);
    if (!user) throw new BadRequestException(`Incorrect email`);
    const isPassCorrect = await bcrypt.compare(dto.password, user.password);
    if (!isPassCorrect) throw new BadRequestException('Incorrect password');
    return this.jwtService.sign({sub: user._id});
  }

  public validateUser(id: string): Promise<User> {
    return this.userService.getOneById(id)
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  private async encodePassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
