import { Test, TestingModule } from '@nestjs/testing';
import { BookServiceController } from './book-service.controller';
import { BookServiceService } from './book-service.service';

describe('BookServiceController', () => {
  let bookServiceController: BookServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookServiceController],
      providers: [BookServiceService],
    }).compile();

    bookServiceController = app.get<BookServiceController>(
      BookServiceController,
    );
  });

  describe('health', () => {
    it('should return "book-service is healthy!"', () => {
      expect(bookServiceController.getHealth()).toBe(
        'book-service is healthy!',
      );
    });
  });
});
