import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookServiceService } from './book-service.service';
import { Book } from './book.entity';
import { Review } from './review.entity';

describe('BookServiceService', () => {
  let service: BookServiceService;
  const mockRmqClient = {
    emit: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto: Partial<Book>) => dto as Book),
    save: jest
      .fn()
      .mockImplementation((book: Book) =>
        Promise.resolve(Object.assign(new Book(), { id: 1 }, book)),
      ),
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Book' } as Book]),
  };

  const mockReviewRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((review) =>
        Promise.resolve({ id: 1, ...review, book: { id: review.bookId } }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookServiceService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
        {
          provide: 'RMQ_CLIENT',
          useValue: mockRmqClient,
        },
      ],
    }).compile();

    service = module.get<BookServiceService>(BookServiceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new book and emit event', async () => {
    const result = await service.create({
      title: 'Test',
      author: 'Author',
      price: 10,
      category: 'Fantasy',
      description: 'Desc',
    });
    expect(result).toEqual({
      id: 1,
      title: 'Test',
      author: 'Author',
      price: 10,
      category: 'Fantasy',
      description: 'Desc',
    });
    expect(mockRmqClient.emit).toHaveBeenCalledWith('book_created', result);
  });

  it('should return all books', async () => {
    expect(await service.findAll()).toEqual([
      { id: 1, title: 'Test Book' } as Book,
    ]);
  });

  it('should add a review to a book and emit event', async () => {
    const result = await service.addReview(1, {
      rating: 5,
      content: 'Great!',
      bookId: 1,
    });
    expect(result).toEqual({
      id: 1,
      rating: 5,
      content: 'Great!',
      bookId: 1,
      book: { id: 1 },
    });
    expect(mockRmqClient.emit).toHaveBeenCalledWith('review_added', result);
  });
});
