// Libraries
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Main module
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(3000);

  app.enableCors();
  
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    errorHttpStatusCode: 406,}
    ));
}
bootstrap();
