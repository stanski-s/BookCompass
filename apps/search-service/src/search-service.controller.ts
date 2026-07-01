import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SearchServiceService, BookPayload } from './search-service.service';

@Controller()
export class SearchServiceController {
  constructor(private readonly searchServiceService: SearchServiceService) {}

  @EventPattern('book_created')
  async handleBookCreated(@Payload() book: BookPayload) {
    await this.searchServiceService.indexBook(book);
  }

  @EventPattern('book_updated')
  async handleBookUpdated(@Payload() book: BookPayload) {
    await this.searchServiceService.indexBook(book);
  }
}
