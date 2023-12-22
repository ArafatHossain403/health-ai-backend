import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    // check if user exist with this email

    return this.prisma.user.create({
      data,
    });
  }

  // async createUser(data: Prisma.UserCreateInput): Promise<User> {
  //   // Destructure the email from the data object
  //   const { email } = data;

  //   // Check if a user with the given email already exists
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: { email },
  //   });

  //   // If a user with the email already exists, you can handle this accordingly (throw an error, return a message, etc.)
  //   if (existingUser) {
  //     throw new Error('User with this email already exists');
  //   }

  //   // If the user doesn't exist, create a new user
  //   return this.prisma.user.create({
  //     data,
  //   });
  // }

  async validateUser(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password (you might want to use a password hashing library)
    const isPasswordValid = user.password === password; // This is a basic example, not secure
    if (!isPasswordValid) {
      return null; // Return null for invalid credentials
    }

    // Return user details upon successful login
    return {
      userId: user.id,
      email: user.email,
      // Add other user fields as needed
    };
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
