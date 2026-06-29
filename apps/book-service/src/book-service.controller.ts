import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookServiceService } from './book-service.service';
import { CreateBookDto } from './create-book.dto';
import { CreateReviewDto } from './create-review.dto';

@Controller()
export class BookServiceController {
  constructor(private readonly bookServiceService: BookServiceService) {}

  @MessagePattern('book.health')
  getHealth(): string {
    return this.bookServiceService.getHealth();
  }

  @MessagePattern('book.create')
  create(@Payload() createBookDto: CreateBookDto) {
    return this.bookServiceService.create(createBookDto);
  }

  @MessagePattern('book.findAll')
  findAll() {
    return this.bookServiceService.findAll();
  }

  @MessagePattern('book.addReview')
  addReview(
    @Payload() payload: { bookId: number; createReviewDto: CreateReviewDto },
  ) {
    return this.bookServiceService.addReview(
      payload.bookId,
      payload.createReviewDto,
    );
  }
}
