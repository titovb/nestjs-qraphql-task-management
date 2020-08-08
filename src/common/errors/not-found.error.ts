import {ApolloError} from 'apollo-server';

export class NotFoundError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any>) {
    super(message, 'NOT_FOUND', extensions);
    Object.defineProperty(this, 'name', {value: 'NotFoundError'});
  }
}
