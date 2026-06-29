import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './auth-user.entity';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUserRepository: Repository<AuthUser>,
    private readonly jwtService: JwtService
  ) {}

  getHello(): string {
    return 'Auth Service is running!';
  }

  async register(registerDto: any) {
    const existing = await this.authUserRepository.findOne({ where: { email: registerDto.email } });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const password_hash = await bcrypt.hash(registerDto.password, 10);
    const user = this.authUserRepository.create({
      email: registerDto.email,
      password_hash,
    });
    const savedUser = await this.authUserRepository.save(user);
    return { id: savedUser.id, email: savedUser.email };
  }

  async login(loginDto: any) {
    const user = await this.authUserRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(changePasswordDto: any) {
    const user = await this.authUserRepository.findOne({ where: { id: changePasswordDto.id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.password_hash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.authUserRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}
