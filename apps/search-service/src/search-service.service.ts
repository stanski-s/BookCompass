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

export interface SearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

interface EsQuery {
  bool: {
    must: Record<string, unknown>[];
    filter: Record<string, unknown>[];
  };
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

  async searchBooks(params: SearchParams) {
    const esQuery: EsQuery = { bool: { must: [], filter: [] } };

    if (params.q) {
      esQuery.bool.must.push({
        multi_match: {
          query: params.q,
          fields: ['title', 'author', 'description'],
        },
      });
    } else {
      esQuery.bool.must.push({ match_all: {} });
    }

    if (params.category) {
      esQuery.bool.filter.push({ match: { categories: params.category } });
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      const priceRange: { gte?: number; lte?: number } = {};
      if (params.minPrice !== undefined)
        priceRange.gte = Number(params.minPrice);
      if (params.maxPrice !== undefined)
        priceRange.lte = Number(params.maxPrice);
      esQuery.bool.filter.push({ range: { price: priceRange } });
    }

    if (params.minRating !== undefined) {
      esQuery.bool.filter.push({
        range: { averageRating: { gte: Number(params.minRating) } },
      });
    }

    const result = await this.esClient.search({
      index: 'books',
      query: esQuery as unknown as Record<string, unknown>,
    });
    return (result.hits.hits || []).map(
      (hit: unknown) => (hit as { _source: BookPayload })._source,
    );
  }
}
