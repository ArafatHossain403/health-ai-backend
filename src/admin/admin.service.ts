import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { Admin } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (admin && admin.password === password) {
      return admin;
    }

    return null;
  }

  async loginAdmin(email: string, password: string): Promise<string> {
    const admin = await this.validateAdmin(email, password);

    if (!admin) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }

  async getAdminProfile(req: Request): Promise<Admin> {
    const admin: Admin = req['admin'];
    if (!admin) throw new BadRequestException('Invalid access token');
    return await this.prisma.admin.findFirst({
      where: { id: admin.id },
    });
  }
}
