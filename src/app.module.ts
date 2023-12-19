import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './user.service';
import { PrismaService } from './prisma.service';
// import { PrismaService } from './prisma.service';

@Module({
  controllers: [AppController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
