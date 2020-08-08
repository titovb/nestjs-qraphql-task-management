import {BadRequestException, Catch, ExceptionFilter, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {AuthenticationError, UserInputError} from 'apollo-server';
import {NotFoundError} from './not-found.error';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: any): any {
    if (exception instanceof UnauthorizedException) {
      return new AuthenticationError(exception.message);
    }
    if (exception instanceof BadRequestException) {
      return new UserInputError(
        typeof exception.getResponse() === 'string' ?
          exception.getResponse() :
          (exception.getResponse() as Record<string, any>).message
      );
    }
    if (exception instanceof NotFoundException) {
      return new NotFoundError(exception.message);
    }
    return exception;
  }
}
