import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UlidService } from 'src/lib/ulid/ulid.service';
import { CreateUserDto, UpdateUserDto, UserType } from 'src/types/user.types';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ulidService: UlidService,
  ) {}

  async findById(id: string): Promise<UserType | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserType | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByMobile(mobile: string): Promise<UserType | null> {
    return await this.prisma.user.findUnique({
      where: { mobile },
    });
  }

  async emailExist(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async mobileExist(mobile: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { mobile },
    });
    return count > 0;
  }

  async upsert(data: CreateUserDto): Promise<UserType | null> {
    return this.prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {},
      create: {
        id: this.ulidService.generateUserId('user'),
        ...data,
      },
    });
  }

  async create(data: CreateUserDto): Promise<UserType | null> {
    return this.prisma.user.create({
      data: {
        id: this.ulidService.generateUserId('user'),
        ...data,
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserType | null> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }
}
