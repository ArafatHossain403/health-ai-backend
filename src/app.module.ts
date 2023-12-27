// app.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './helper/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Change this to a secure random key
      signOptions: { expiresIn: '1h' }, // Adjust the expiration time as needed
    }),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, AdminService, PrismaService],
})
export class AppModule {}
