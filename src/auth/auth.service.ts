import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && (await this.validatePassword(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    const { password_hash, ...result } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validatePassword(password: string, passwordHash: string) {
    return compare(password, passwordHash);
  }
}
