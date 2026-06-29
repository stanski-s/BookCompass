import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookServiceService } from './book-service.service';
import { CreateBookDto } from './create-book.dto';
import { CreateReviewDto } from './create-review.dto';

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

  @Post(':id/reviews')
  addReview(@Param('id') id: number, @Body() createReviewDto: CreateReviewDto) {
    return this.bookServiceService.addReview(id, createReviewDto);
  }
}
