import { Controller, Get } from '@nestjs/common';
import { BookServiceService } from './book-service.service';

@Controller('books')
export class BookServiceController {
  constructor(private readonly bookServiceService: BookServiceService) {}

  @Get('health')
  getHealth(): string {
    return this.bookServiceService.getHealth();
  }
}
