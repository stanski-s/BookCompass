import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get('health')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userServiceService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userServiceService.findAll();
  }
}
