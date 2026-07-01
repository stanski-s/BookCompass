import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { BookServiceService } from './book-service.service';
import { CreateBookDto } from './create-book.dto';

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

  @MessagePattern('book.bestsellers')
  getBestsellers() {
    return this.bookServiceService.getBestsellers();
  }

  @MessagePattern('book.findById')
  findById(@Payload() id: number) {
    return this.bookServiceService.findById(id);
  }

  @EventPattern('review_created')
  handleReviewCreated(@Payload() data: { bookId: number; rating: number }) {
    return this.bookServiceService.updateReviewStats(data.bookId, data.rating);
  }
}
