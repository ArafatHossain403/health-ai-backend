import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User, User as UserModel } from '@prisma/client';

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
      birth_date: string;
    },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
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

  @Get('/list')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}
