// app.module.ts

import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './helper/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { DiagnosisController } from './diagnosis/diagnosis.controller';
import { DiagnosisService } from './diagnosis/diagnosis.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretText', // Change this to a secure random key
      signOptions: { expiresIn: process.env.JWT_EXPIRY || '24h' }, // Adjust the expiration time as needed
    }),
  ],
  controllers: [UserController, AdminController, DiagnosisController],
  providers: [UserService, AdminService, PrismaService, DiagnosisService],
})
export class AppModule {}
