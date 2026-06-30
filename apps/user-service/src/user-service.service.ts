import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      id: createUserDto.id,
      username: createUserDto.username,
      bio: createUserDto.bio,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getCart(userId: string): Promise<CartItem[]> {
    return this.cartItemRepository.find({ where: { user: { id: userId } } });
  }

  async addToCart(
    userId: string,
    bookId: number,
    quantity: number,
  ): Promise<CartItem> {
    const existing = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, bookId },
    });
    if (existing) {
      existing.quantity += quantity;
      return this.cartItemRepository.save(existing);
    }
    const cartItem = this.cartItemRepository.create({
      user: { id: userId },
      bookId,
      quantity,
    });
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(userId: string, bookId: number): Promise<void> {
    await this.cartItemRepository.delete({ user: { id: userId }, bookId });
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ user: { id: userId } });
  }
}
