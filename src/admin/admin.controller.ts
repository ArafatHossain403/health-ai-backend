import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Admin } from '@prisma/client';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  async loginAdmin(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.service.loginAdmin(
      loginData.email,
      loginData.password,
    );
    return { accessToken };
  }

  @UseGuards(AdminGuard)
  @Get('/profile')
  async getUSerProfile(@Req() req: Request): Promise<Admin> {
    return await this.service.getAdminProfile(req);
  }
}
