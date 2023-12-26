import { Controller, Post, Body } from '@nestjs/common';
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
  async loginUser(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.userService.loginUser(
      loginData.email,
      loginData.password,
    );
    return { accessToken };
  }
}
