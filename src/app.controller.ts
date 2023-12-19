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
}
