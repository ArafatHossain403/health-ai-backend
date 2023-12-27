// users.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token);
      const adminEmail = decoded.email;

      // Retrieve user from the database based on the email
      return this.prisma.admin
        .findUnique({ where: { email: adminEmail } })
        .then((admin) => {
          if (!admin) {
            return false;
          }

          // Attach user data to the request for use in the route handler
          request.admin = admin;
          return true;
        });
    } catch (error) {
      return false;
    }
  }
}
