import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserServiceService } from './user-service.service';
import { CreateUserDto } from './create-user.dto';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern('user.health')
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @MessagePattern('user.createProfile')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userServiceService.create(createUserDto);
  }

  @MessagePattern('user.findAll')
  findAll() {
    return this.userServiceService.findAll();
  }
}
