import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { lastValueFrom } from 'rxjs';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';

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
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.apiGatewayService.register(registerDto);
    response.cookie('accessToken', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    response.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Registration successful', username: result.username };
  }

  @Post('auth/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await lastValueFrom(this.apiGatewayService.login(loginDto));
    response.cookie('accessToken', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    response.cookie('refreshToken', result.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Login successful' };
  }

  @Post('auth/refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshTokenCookie = request.cookies['refreshToken'] as string | undefined;
    if (!refreshTokenCookie) {
      throw new UnauthorizedException('Missing refresh token');
    }
    
    // We assume we can decode it here to get the userId, or auth-service handles it
    // Wait, the authService expects { userId: string; refreshToken: string }
    // Let's extract the user ID by decoding it. Or better, just let auth-service verify the refresh token.
    // Let's decode it safely (just payload) because it's a JWT.
    try {
      const payload = JSON.parse(
        Buffer.from(refreshTokenCookie.split('.')[1], 'base64').toString(),
      ) as { sub: string };
      
      const result = await lastValueFrom(
        this.apiGatewayService.refreshTokens({
          userId: payload.sub,
          refreshToken: refreshTokenCookie,
        })
      );
      
      response.cookie('accessToken', result.access_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
      response.cookie('refreshToken', result.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });
      return { message: 'Refresh successful' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('auth/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logout successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  getMe(@CurrentUser() payload: { sub: string }) {
    return { userId: payload.sub };
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

  @UseGuards(JwtAuthGuard)
  @Get('cart')
  getCart(@CurrentUser() payload: { sub: string }) {
    return this.apiGatewayService.getCart(payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cart')
  addToCart(
    @CurrentUser() payload: { sub: string },
    @Body() body: { bookId: number; quantity?: number },
  ) {
    return this.apiGatewayService.addToCart(
      payload.sub,
      body.bookId,
      body.quantity || 1,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cart/:bookId')
  removeFromCart(
    @CurrentUser() payload: { sub: string },
    @Param('bookId') bookId: string,
  ) {
    return this.apiGatewayService.removeFromCart(payload.sub, Number(bookId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/checkout')
  checkout(@CurrentUser() payload: { sub: string }) {
    return this.apiGatewayService.checkout(payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  getOrders(@CurrentUser() payload: { sub: string }) {
    return this.apiGatewayService.getOrders(payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('liked-books')
  getLikedBooks(@CurrentUser() payload: { sub: string }) {
    return this.apiGatewayService.getLikedBooks(payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('liked-books')
  toggleLikedBook(
    @CurrentUser() payload: { sub: string },
    @Body() body: { bookId: number },
  ) {
    return this.apiGatewayService.toggleLikedBook(payload.sub, body.bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reviews')
  addReview(
    @CurrentUser() payload: { sub: string },
    @Body() body: { bookId: number; rating: number; comment?: string },
  ) {
    return this.apiGatewayService.addReview(
      Number(payload.sub),
      body.bookId,
      body.rating,
      body.comment,
    );
  }

  @Get('reviews/book/:bookId')
  getBookReviews(@Param('bookId') bookId: string) {
    return this.apiGatewayService.getBookReviews(Number(bookId));
  }
}
