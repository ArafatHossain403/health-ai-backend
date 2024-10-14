import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Use the dynamic PORT environment variable provided by Render
  const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set

  await app.listen(port);
  console.log(`app started on port: ${port}`);
}
bootstrap();
