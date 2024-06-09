import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChat(@Request() req: any, @Body() dto: CreateChatDto) {
    return this.chatService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userChats')
  async getUserChats(@Request() req: any) {
    return this.chatService.getUserChats(req.user.id);
  }
}
