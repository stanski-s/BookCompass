import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './auth-user.entity';

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface ChangePasswordDto {
  id: string;
  newPassword: string;
}

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUserRepository: Repository<AuthUser>,
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Auth Service is running!';
  }

  private async getTokens(userId: string, email: string) {
    const payload = { sub: userId, username: email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { access_token, refresh_token };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.authUserRepository.update(userId, { refresh_token_hash: hash });
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.authUserRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const password_hash = await bcrypt.hash(registerDto.password, 10);
    const user = this.authUserRepository.create({
      email: registerDto.email,
      password_hash,
    });
    const savedUser = await this.authUserRepository.save(user);
    const tokens = await this.getTokens(savedUser.id, savedUser.email);
    await this.updateRefreshTokenHash(savedUser.id, tokens.refresh_token);
    return { id: savedUser.id, email: savedUser.email, ...tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.authUserRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.authUserRepository.findOne({
      where: { id: changePasswordDto.id },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.password_hash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.authUserRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.authUserRepository.findOne({
      where: { id: userId },
    });
    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Access Denied');
    }
    const rtMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash,
    );
    if (!rtMatches) {
      throw new UnauthorizedException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
