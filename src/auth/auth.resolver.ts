import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from '../user/user.schema';
import {RegisterInput} from './dto/register.input';
import {AuthService} from './auth.service';
import {LoginInput} from './dto/login.input';
import {CurrentUser} from './current-user.decorator';
import {UseGuards} from '@nestjs/common';
import {JwtGuard} from './jwt.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(()  => User)
  register(@Args('registerData') registerData: RegisterInput): Promise<User> {
    return this.authService.register(registerData);
  }

  @Mutation(() => String)
  login(@Args('loginData') loginData: LoginInput): Promise<string> {
    return this.authService.login(loginData);
  }

  @Query(() => User)
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }
}
