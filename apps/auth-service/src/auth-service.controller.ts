import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';

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

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern('auth.health')
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @MessagePattern('auth.register')
  register(@Payload() registerDto: RegisterDto) {
    return this.authServiceService.register(registerDto);
  }

  @MessagePattern('auth.login')
  login(@Payload() loginDto: LoginDto) {
    return this.authServiceService.login(loginDto);
  }

  @MessagePattern('auth.change_password')
  changePassword(@Payload() changePasswordDto: ChangePasswordDto) {
    return this.authServiceService.changePassword(changePasswordDto);
  }

  @MessagePattern('auth.refresh')
  refreshTokens(@Payload() payload: { userId: string; refreshToken: string }) {
    return this.authServiceService.refreshTokens(
      payload.userId,
      payload.refreshToken,
    );
  }
}
