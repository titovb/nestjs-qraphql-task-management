import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = await app.get(ConfigService);
  await app.listen(config.get<number>('APP_PORT'), config.get<string>('APP_HOST'));
}
bootstrap();
