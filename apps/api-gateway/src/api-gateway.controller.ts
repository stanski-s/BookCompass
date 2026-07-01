import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

function extractUserId(authHeader?: string): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing token');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as { sub: string };
    return payload.sub;
  } catch {
    throw new UnauthorizedException('Invalid token');
  }
}

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

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Post('auth/register')
  register(@Body() registerDto: RegisterDto) {
    return this.apiGatewayService.register(registerDto);
  }

  @Post('auth/login')
  login(@Body() loginDto: LoginDto) {
    return this.apiGatewayService.login(loginDto);
  }

  @Post('auth/refresh')
  refreshTokens(@Body() refreshDto: { userId: string; refreshToken: string }) {
    return this.apiGatewayService.refreshTokens(refreshDto);
  }

  @Get('books')
  getBooks() {
    return this.apiGatewayService.getBooks();
  }

  @Get('books/bestsellers')
  getBestsellers() {
    return this.apiGatewayService.getBestsellers();
  }

  @Get('books/:id')
  getBookById(@Param('id') id: string) {
    return this.apiGatewayService.getBookById(Number(id));
  }

  @Post('books')
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.apiGatewayService.createBook(createBookDto);
  }

  @Get('cart')
  getCart(@Headers('authorization') authHeader: string) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.getCart(userId);
  }

  @Post('cart')
  addToCart(
    @Headers('authorization') authHeader: string,
    @Body() body: { bookId: number; quantity?: number },
  ) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.addToCart(
      userId,
      body.bookId,
      body.quantity || 1,
    );
  }

  @Delete('cart/:bookId')
  removeFromCart(
    @Headers('authorization') authHeader: string,
    @Param('bookId') bookId: string,
  ) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.removeFromCart(userId, Number(bookId));
  }

  @Post('orders/checkout')
  checkout(@Headers('authorization') authHeader: string) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.checkout(userId);
  }

  @Get('orders')
  getOrders(@Headers('authorization') authHeader: string) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.getOrders(userId);
  }

  @Get('liked-books')
  getLikedBooks(@Headers('authorization') authHeader: string) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.getLikedBooks(userId);
  }

  @Post('liked-books')
  toggleLikedBook(
    @Headers('authorization') authHeader: string,
    @Body() body: { bookId: number },
  ) {
    const userId = extractUserId(authHeader);
    return this.apiGatewayService.toggleLikedBook(userId, body.bookId);
  }
}
