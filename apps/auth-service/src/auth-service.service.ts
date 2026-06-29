import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceService {
  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Auth Service is running!';
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
