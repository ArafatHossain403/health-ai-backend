import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Request } from 'express';
import { AdminModel } from 'src/helper/types';

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
  async getUSerProfile(@Req() req: Request): Promise<AdminModel> {
    return await this.service.getAdminProfile(req);
  }
}
