import { Test, TestingModule } from '@nestjs/testing';
import { BookServiceController } from './book-service.controller';
import { BookServiceService } from './book-service.service';
import { Book } from './book.entity';

describe('BookServiceController', () => {
  let bookServiceController: BookServiceController;
  let bookServiceService: BookServiceService;

  beforeEach(async () => {
    const mockBookService = {
      getHealth: jest.fn().mockReturnValue('book-service is healthy!'),
      create: jest.fn(),
      findAll: jest.fn(),
      addReview: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookServiceController],
      providers: [
        {
          provide: BookServiceService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookServiceController = app.get<BookServiceController>(
      BookServiceController,
    );
    bookServiceService = app.get<BookServiceService>(BookServiceService);
  });

  describe('health', () => {
    it('should return "book-service is healthy!"', () => {
      expect(bookServiceController.getHealth()).toBe(
        'book-service is healthy!',
      );
    });
  });

  describe('books', () => {
    it('should create a book', async () => {
      const result: Book = {
        id: 1,
        title: 'Test',
        author: 'Author',
        price: 10,
        category: 'Fantasy',
        description: 'Desc',
      };
      jest.spyOn(bookServiceService, 'create').mockResolvedValue(result);
      expect(
        await bookServiceController.create({
          title: 'Test',
          author: 'Author',
          price: 10,
          category: 'Fantasy',
          description: 'Desc',
        }),
      ).toBe(result);
    });

    it('should get all books', async () => {
      const result: Book[] = [{ id: 1, title: 'Test', author: 'Author', price: 10, category: 'Fantasy', description: 'Desc', reviews: [] }];
      jest
        .spyOn(bookServiceService, 'findAll')
        .mockResolvedValue(result);
      expect(await bookServiceController.findAll()).toBe(result);
    });

    it('should add a review to a book', async () => {
      const result: any = { id: 1, rating: 5, content: 'Great!', book: { id: 1 } };
      jest.spyOn(bookServiceService, 'addReview').mockResolvedValue(result);
      expect(
        await bookServiceController.addReview(1, { rating: 5, content: 'Great!', bookId: 1 })
      ).toBe(result);
    });
  });
});
