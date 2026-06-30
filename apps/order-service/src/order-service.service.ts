import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

interface ICartItem {
  bookId: number;
  quantity: number;
}

interface IBook {
  id: number;
  price: number;
}

@Injectable()
export class OrderServiceService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
  ) {}

  async checkout(userId: string): Promise<Order> {
    // 1. Fetch Cart
    const cartItems = await lastValueFrom(
      this.userClient.send<ICartItem[]>('user.getCart', userId),
    );

    if (!cartItems || cartItems.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    // 2. Fetch Books and calculate total
    let totalAmount = 0;
    const itemsToSave: Partial<OrderItem>[] = [];

    for (const item of cartItems) {
      const book = await lastValueFrom(
        this.bookClient.send<IBook>('book.findById', item.bookId),
      );

      if (!book) {
        throw new HttpException(
          `Book with ID ${item.bookId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      totalAmount += Number(book.price) * item.quantity;
      itemsToSave.push({
        bookId: book.id,
        quantity: item.quantity,
        priceAtPurchase: book.price,
      });
    }

    // 3. Create Order
    const order = this.orderRepository.create({
      userId,
      totalAmount,
      status: OrderStatus.COMPLETED, // Mark as completed for now
    });
    const savedOrder = await this.orderRepository.save(order);

    // 4. Create OrderItems
    for (const item of itemsToSave) {
      const orderItem = this.orderItemRepository.create({
        ...item,
        order: savedOrder,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // 5. Clear Cart
    this.userClient.emit('user.clearCart', userId);

    return savedOrder;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}
