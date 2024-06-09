import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string, dto: CreateChatDto) {
    const chat = await this.prisma.chat.create({
      data: {
        name: dto.name,
      },
    });

    const user1 = await this.prisma.usersOnChats.create({
      data: {
        chatId: chat.id,
        userId: creatorId,
      },
    });

    const user2 = await this.prisma.usersOnChats.create({
      data: {
        chatId: chat.id,
        userId: dto.userId,
      },
    });

    return { chat, users: [user1, user2] };
  }

  async getUserChats(userId: string) {
    const chats = this.prisma.chat.findMany({
      where: {
        UsersOnChats: {
          some: {
            userId,
          },
        },
      },
    });

    return chats;
  }
}
