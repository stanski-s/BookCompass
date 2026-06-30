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

  @MessagePattern('user.getCart')
  getCart(@Payload() userId: string) {
    return this.userServiceService.getCart(userId);
  }

  @MessagePattern('user.addToCart')
  addToCart(
    @Payload() payload: { userId: string; bookId: number; quantity: number },
  ) {
    return this.userServiceService.addToCart(
      payload.userId,
      payload.bookId,
      payload.quantity,
    );
  }

  @MessagePattern('user.removeFromCart')
  removeFromCart(@Payload() payload: { userId: string; bookId: number }) {
    return this.userServiceService.removeFromCart(
      payload.userId,
      payload.bookId,
    );
  }

  @MessagePattern('user.clearCart')
  clearCart(@Payload() userId: string) {
    return this.userServiceService.clearCart(userId);
  }
}
