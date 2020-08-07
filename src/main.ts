import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = await app.get(ConfigService);
  await app.listen(config.get<number>('APP_PORT'), config.get<string>('APP_HOST'));
}
bootstrap();
