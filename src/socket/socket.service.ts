import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto/message.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketService implements OnGatewayConnection {
  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleEvent(
    @MessageBody() dto: MessageDto,
    @ConnectedSocket() client: any,
  ) {
    await this.addMessage(dto);
    const messages = await this.getMessages(dto.chatId);

    this.server.emit('updateMessages', messages);
  }

  async handleConnection(client: any) {
    const chatId = client.handshake.query.chatId;
    const messages = await this.getMessages(chatId);
    this.server.emit('updateMessages', messages);
    console.log('CONNECTED');
    console.log(client);
  }

  async getMessages(chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        user: {
          select: {
            email: true,
            full_name: true,
            username: true,
          },
        },
      },
    });

    return messages;
  }

  async addMessage(dto: MessageDto) {
    await this.prisma.message.create({
      data: {
        text: dto.text,
        chatId: dto.chatId,
        userId: dto.userId,
      },
    });
  }
}
