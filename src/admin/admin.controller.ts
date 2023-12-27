import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: AdminService) {}

  @Post('login')
  async loginAdmin(
    @Body() loginData: { email: string; password: string },
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.userService.loginAdmin(
      loginData.email,
      loginData.password,
    );
    return { accessToken };
  }
}
