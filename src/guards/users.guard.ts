import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../helper/prisma.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      const adminEmail = decoded.email;

      // Retrieve user from the database based on the email
      const user = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });
      if (user) {
        request.user = user;
        return true;
      } else false;
    } catch (error) {
      return false;
    }
  }
}
