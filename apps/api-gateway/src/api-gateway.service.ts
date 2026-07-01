import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}
export interface LoginDto {
  email: string;
  password: string;
}
export interface CreateBookDto {
  title: string;
  author?: string;
  price?: number;
  categories?: string[];
  description?: string;
  coverUrl?: string;
}

@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
    @Inject('SEARCH_SERVICE') private readonly searchClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'API Gateway is working!';
  }

  async register(registerDto: RegisterDto) {
    try {
      // 1. Create auth user
      const authResult = await lastValueFrom(
        this.authClient.send<{
          id: string;
          access_token: string;
          refresh_token: string;
        }>('auth.register', registerDto),
      );
      // 2. Create user profile using the returned UUID
      const userResult = await lastValueFrom(
        this.userClient.send<{ username: string }>('user.createProfile', {
          id: authResult.id,
          username: registerDto.username || registerDto.email.split('@')[0],
          bio: '',
        }),
      );
      return {
        message: 'Registration successful',
        id: authResult.id,
        username: userResult.username,
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
      };
    } catch (e: unknown) {
      const error = e as { message?: string; status?: number };
      throw new HttpException(
        error.message || 'Registration failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  login(loginDto: LoginDto) {
    return this.authClient.send<{
      access_token: string;
      refresh_token: string;
    }>('auth.login', loginDto);
  }

  refreshTokens(refreshDto: { userId: string; refreshToken: string }) {
    return this.authClient.send<{
      access_token: string;
      refresh_token: string;
    }>('auth.refresh', refreshDto);
  }

  getBooks() {
    return this.bookClient.send<unknown[]>('book.findAll', {});
  }

  getBestsellers() {
    return this.bookClient.send<unknown[]>('book.bestsellers', {});
  }

  getBookById(id: number) {
    return this.bookClient.send<unknown>('book.findById', id);
  }

  createBook(createBookDto: CreateBookDto) {
    return this.bookClient.send<unknown>('book.create', createBookDto);
  }

  getCart(userId: string) {
    return this.userClient.send<unknown[]>('user.getCart', userId);
  }

  addToCart(userId: string, bookId: number, quantity: number) {
    return this.userClient.send<unknown>('user.addToCart', {
      userId,
      bookId,
      quantity,
    });
  }

  removeFromCart(userId: string, bookId: number) {
    return this.userClient.send<unknown>('user.removeFromCart', {
      userId,
      bookId,
    });
  }

  checkout(userId: string) {
    return this.orderClient.send<unknown>('order.checkout', userId);
  }

  getOrders(userId: string) {
    return this.orderClient.send<unknown[]>('order.getOrders', userId);
  }

  toggleLikedBook(userId: string, bookId: number) {
    return this.userClient.send<{ success: boolean; isLiked: boolean }>(
      'user.toggleLike',
      {
        userId,
        bookId,
      },
    );
  }

  getLikedBooks(userId: string) {
    return this.userClient.send<number[]>('user.getLikes', userId);
  }

  addReview(userId: string, bookId: number, rating: number, comment?: string) {
    return this.reviewClient.send('add_review', {
      userId,
      bookId,
      rating,
      comment,
    });
  }

  getBookReviews(bookId: number) {
    return this.reviewClient.send('get_book_reviews', { bookId });
  }

  searchBooks(query: any) {
    return this.searchClient.send('search.query', query);
  }
}
