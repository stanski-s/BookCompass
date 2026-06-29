import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookServiceService } from './book-service.service';
import { CreateBookDto } from './create-book.dto';

@Controller('books')
export class BookServiceController {
  constructor(private readonly bookServiceService: BookServiceService) {}

  @Get('health')
  getHealth(): string {
    return this.bookServiceService.getHealth();
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookServiceService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookServiceService.findAll();
  }
}
