import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

export interface BookPayload {
  id: number;
  title: string;
  author: string;
  price: number;
  description: string;
  categories: string[];
  averageRating: number;
  reviewCount: number;
}

@Injectable()
export class SearchServiceService implements OnModuleInit {
  private readonly esClient: Client;

  constructor() {
    this.esClient = new Client({ node: 'http://localhost:9200' });
  }

  async onModuleInit() {
    const indexExists = await this.esClient.indices.exists({ index: 'books' });
    if (!indexExists) {
      await this.esClient.indices.create({ index: 'books' });
    }
  }

  async indexBook(book: BookPayload) {
    await this.esClient.index({
      index: 'books',
      id: String(book.id),
      document: book,
    });
  }

  async deleteBook(bookId: number) {
    await this.esClient.delete({
      index: 'books',
      id: String(bookId),
    });
  }
}
