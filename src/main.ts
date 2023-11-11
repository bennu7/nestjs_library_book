import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from './exceptions/error.exception';
import validationOptions from './utils/valiation-option';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
