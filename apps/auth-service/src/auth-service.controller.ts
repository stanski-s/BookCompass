import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Get('health')
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authServiceService.login(loginDto);
  }
}
