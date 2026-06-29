import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get('health')
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Post('register')
  register(@Body() registerDto: any) {
    return this.authServiceService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authServiceService.login(loginDto);
  }

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: any) {
    return this.authServiceService.changePassword(changePasswordDto);
  }
}
