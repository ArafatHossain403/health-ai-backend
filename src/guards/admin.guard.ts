import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../helper/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
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

      // Retrieve admin from the database based on the email
      const admin = await this.prisma.admin.findUnique({
        where: { email: adminEmail },
      });
      if (admin) {
        request.admin = admin;
        return true;
      } else false;
    } catch (error) {
      return false;
    }
  }
}
