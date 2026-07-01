import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { SearchServiceService } from './search-service.service';
import type { BookPayload, SearchParams } from './search-service.service';

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

  @MessagePattern('search.query')
  async handleSearchQuery(@Payload() params: SearchParams) {
    return this.searchServiceService.searchBooks(params);
  }
}
