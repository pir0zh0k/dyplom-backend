import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { genSalt, hash } from 'bcrypt';
import { UserStatusDto } from './dto/user-status.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (candidate)
      throw new BadRequestException('Такой пользователь существует');

    const user = { ...dto, password: dto.password };

    const salt = await genSalt();
    user.password = await hash(user.password, salt);

    const dbUSer = await this.prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password_hash: user.password,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role,
      },
    });

    const { password_hash, ...result } = dbUSer;

    return result;
  }

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async getById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    const { password_hash, ...result } = user;

    return result;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) throw new BadRequestException('ПОльзователь не найден');

    const deleted = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return deleted;
  }

  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    if (!user) throw new BadRequestException('Не обновлено');

    const { password_hash, ...result } = user;

    return result;
  }
}
