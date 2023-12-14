import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CatsController } from './cats.controller';

@Module({
  controllers: [UsersController, CatsController],
})
export class AppModule {}
