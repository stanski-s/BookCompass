import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { CreateUserDto } from './create-user.dto';

import { LikedBook } from './liked-book.entity';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(LikedBook)
    private readonly likedBookRepository: Repository<LikedBook>,
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
  ): Promise<CartItem | { success: boolean }> {
    const existing = await this.cartItemRepository.findOne({
      where: { user: { id: userId }, bookId },
    });
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity <= 0) {
        await this.cartItemRepository.remove(existing);
        return { success: true };
      }
      return this.cartItemRepository.save(existing);
    }
    if (quantity <= 0) {
      return { success: true };
    }
    const cartItem = this.cartItemRepository.create({
      user: { id: userId },
      bookId,
      quantity,
    });
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(
    userId: string,
    bookId: number,
  ): Promise<{ success: boolean }> {
    const items = await this.cartItemRepository.find({
      where: { user: { id: userId }, bookId },
    });
    if (items.length > 0) {
      await this.cartItemRepository.remove(items);
    }
    return { success: true };
  }

  async clearCart(userId: string): Promise<{ success: boolean }> {
    const items = await this.cartItemRepository.find({
      where: { user: { id: userId } },
    });
    if (items.length > 0) {
      await this.cartItemRepository.remove(items);
    }
    return { success: true };
  }

  async toggleLikedBook(
    userId: string,
    bookId: number,
  ): Promise<{ success: boolean; isLiked: boolean }> {
    const existing = await this.likedBookRepository.findOne({
      where: { user: { id: userId }, bookId },
    });

    if (existing) {
      await this.likedBookRepository.remove(existing);
      return { success: true, isLiked: false };
    }

    const newLikedBook = this.likedBookRepository.create({
      user: { id: userId },
      bookId,
    });
    await this.likedBookRepository.save(newLikedBook);
    return { success: true, isLiked: true };
  }

  async getLikedBooks(userId: string): Promise<number[]> {
    const likedBooks = await this.likedBookRepository.find({
      where: { user: { id: userId } },
    });
    return likedBooks.map((lb) => lb.bookId);
  }
}
