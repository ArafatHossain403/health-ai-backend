import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body()
    userData: {
      name?: string;
      email: string;
      password: string;
      mobile: string;
      address: string;
    },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Post('login')
  async login(@Request() req) {
    return req.user; // req.user will contain the authenticated user details
  }

  // Example of a protected route
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
