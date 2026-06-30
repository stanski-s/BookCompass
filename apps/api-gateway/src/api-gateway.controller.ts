import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

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
}
