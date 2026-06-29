import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }

  @Post('auth/register')
  register(@Body() registerDto: any) {
    return this.apiGatewayService.register(registerDto);
  }

  @Post('auth/login')
  login(@Body() loginDto: any) {
    return this.apiGatewayService.login(loginDto);
  }

  @Get('books')
  getBooks() {
    return this.apiGatewayService.getBooks();
  }

  @Post('books')
  createBook(@Body() createBookDto: any) {
    return this.apiGatewayService.createBook(createBookDto);
  }
}
