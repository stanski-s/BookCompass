import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern('auth.health')
  getHello(): string {
    return this.authServiceService.getHello();
  }

  @MessagePattern('auth.register')
  register(@Payload() registerDto: any) {
    return this.authServiceService.register(registerDto);
  }

  @MessagePattern('auth.login')
  login(@Payload() loginDto: any) {
    return this.authServiceService.login(loginDto);
  }

  @MessagePattern('auth.change_password')
  changePassword(@Payload() changePasswordDto: any) {
    return this.authServiceService.changePassword(changePasswordDto);
  }
}
