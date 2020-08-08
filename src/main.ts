import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';
import {GqlExceptionFilter} from './common/errors/gql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GqlExceptionFilter());

  const config = await app.get(ConfigService);
  await app.listen(config.get('APP_PORT'), config.get('APP_HOST'));
}
bootstrap();
