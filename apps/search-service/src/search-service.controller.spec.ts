import { Test, TestingModule } from '@nestjs/testing';
import { SearchServiceController } from './search-service.controller';
import { SearchServiceService } from './search-service.service';

describe('SearchServiceController', () => {
  let controller: SearchServiceController;
  let service: {
    indexBook: jest.Mock;
    deleteBook: jest.Mock;
    searchBooks: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      indexBook: jest.fn(),
      deleteBook: jest.fn(),
      searchBooks: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [SearchServiceController],
      providers: [{ provide: SearchServiceService, useValue: service }],
    }).compile();

    controller = app.get<SearchServiceController>(SearchServiceController);
  });

  const getMockBook = () => ({
    id: 1,
    title: 'test',
    author: 'Author',
    price: 10,
    description: 'Desc',
    categories: [],
    averageRating: 0,
    reviewCount: 0,
  });

  it('should handle book_created', async () => {
    const mockBook = getMockBook();
    await controller.handleBookCreated(mockBook);
    expect(service.indexBook).toHaveBeenCalledWith(mockBook);
  });

  it('should handle book_updated', async () => {
    const mockBook = getMockBook();
    await controller.handleBookUpdated(mockBook);
    expect(service.indexBook).toHaveBeenCalledWith(mockBook);
  });

  it('should handle search.query', async () => {
    const params = { q: 'test' };
    service.searchBooks.mockResolvedValue([getMockBook()]);
    const result = await controller.handleSearchQuery(params);
    expect(service.searchBooks).toHaveBeenCalledWith(params);
    expect(result).toEqual([getMockBook()]);
  });
});
