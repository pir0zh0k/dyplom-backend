import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserStatusDto } from './dto/user-status.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  async updateStatus(@Request() req, @Body() dto: UserStatusDto) {
    return this.userService.updateStatus(req.user.id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAll() {
    return this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getById')
  async getById(@Request() req) {
    return this.userService.getById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Request() req) {
    return this.userService.delete(req.user.id);
  }
}
