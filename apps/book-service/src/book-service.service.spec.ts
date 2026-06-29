import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookServiceService } from './book-service.service';
import { Book } from './book.entity';

describe('BookServiceService', () => {
  let service: BookServiceService;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto: Partial<Book>) => dto as Book),
    save: jest
      .fn()
      .mockImplementation((book: Book) =>
        Promise.resolve(Object.assign(new Book(), { id: 1 }, book)),
      ),
    find: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Book' } as Book]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookServiceService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BookServiceService>(BookServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new book', async () => {
    expect(
      await service.create({ title: 'Test', author: 'Author', price: 10 }),
    ).toEqual({
      id: 1,
      title: 'Test',
      author: 'Author',
      price: 10,
    });
  });

  it('should return all books', async () => {
    expect(await service.findAll()).toEqual([{ id: 1, title: 'Test Book' }]);
  });
});
