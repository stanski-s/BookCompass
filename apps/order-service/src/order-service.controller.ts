import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderServiceService } from './order-service.service';

@Controller()
export class OrderServiceController {
  constructor(private readonly orderServiceService: OrderServiceService) {}

  @MessagePattern('order.checkout')
  checkout(@Payload() userId: string) {
    return this.orderServiceService.checkout(userId);
  }

  @MessagePattern('order.getOrders')
  getOrders(@Payload() userId: string) {
    return this.orderServiceService.getOrders(userId);
  }
}
