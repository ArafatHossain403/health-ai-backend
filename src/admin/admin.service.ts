import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { Prisma, Admin } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  usersService: any;
  private readonly jwtSecret: string;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async admin(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Admin | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Admin[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  // async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //   const { email } = data;

  //   const existingUser = await this.prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (existingUser) {
  //     throw new Error('User with this email already exists');
  //   }

  //   return this.prisma.user.create({
  //     data,
  //   });
  // }

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
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }
}
