import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../helper/prisma.service';
import { User, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
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
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const { email } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return await this.prisma.user.create({
      data: {
        ...data,
        birth_date: new Date(data.birth_date),
      },
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  //get user profile
  async getUserProfile(req: Request): Promise<User> {
    const user: User = req['user'];
    if (!user) throw new BadRequestException('Invalid access token');
    return await this.prisma.user.findFirst({
      where: { id: user.id },
    });
  }

  //get all users
  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
