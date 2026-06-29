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
      };
      jest.spyOn(bookServiceService, 'create').mockResolvedValue(result);
      expect(
        await bookServiceController.create({
          title: 'Test',
          author: 'Author',
          price: 10,
        }),
      ).toBe(result);
    });

    it('should get all books', async () => {
      const result: Book[] = [
        { id: 1, title: 'Test', author: 'Author', price: 10 },
      ];
      jest.spyOn(bookServiceService, 'findAll').mockResolvedValue(result);
      expect(await bookServiceController.findAll()).toBe(result);
    });
  });
});
