import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { Request } from 'express';
import { UserGuard } from 'src/guards/users.guard';
import { UserModel } from 'src/helper/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(
    @Body()
    userData: {
      name: string;
      email: string;
      password: string;
      mobile: string;
      address: string;
      gender: string;
      birth_date: string;
    },
  ): Promise<UserModel> {
    return await this.userService.createUser(userData);
  }

  @Post('login')
  async loginUser(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.userService.loginUser(
      loginData.email,
      loginData.password,
    );
    return { accessToken };
  }

  @UseGuards(UserGuard)
  @Get('/profile')
  async getUSerProfile(@Req() req: Request): Promise<UserModel> {
    return await this.userService.getUserProfile(req);
  }

  @UseGuards(AdminGuard)
  @Get('/list')
  async getAllUsers(): Promise<UserModel[]> {
    return await this.userService.getAllUsers();
  }
}
