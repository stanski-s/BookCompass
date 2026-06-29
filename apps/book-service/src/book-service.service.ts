import { Injectable } from '@nestjs/common';

@Injectable()
export class BookServiceService {
  getHealth(): string {
    return 'book-service is healthy!';
  }
}
