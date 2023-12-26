import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//require('dotenv').config();
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.APP_PORT || 3000;

  await app.listen(port);
  console.log(`app started on port: ${port}`);
}
bootstrap();
