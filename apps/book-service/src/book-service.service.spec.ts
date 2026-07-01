import { Test, TestingModule } from '@nestjs/testing';
import { BookServiceService } from './book-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';

describe('BookServiceService', () => {
  let service: BookServiceService;
  let mockBookRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let mockRmqClient: {
    emit: jest.Mock;
  };

  beforeEach(async () => {
    mockBookRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockRmqClient = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookServiceService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: 'RMQ_CLIENT',
          useValue: mockRmqClient,
        },
      ],
    }).compile();

    service = module.get<BookServiceService>(BookServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBestsellers', () => {
    it('should return a limited number of books', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1' },
        { id: 2, title: 'Book 2' },
      ];
      mockBookRepository.find.mockResolvedValue(mockBooks);

      const result = await service.getBestsellers();
      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.find).toHaveBeenCalledWith({
        take: 4,
        order: { id: 'ASC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a specific book', async () => {
      const mockBook = { id: 1, title: 'Book 1' };
      mockBookRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findById(1);
      expect(result).toEqual(mockBook);
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a book and emit book_created', async () => {
      const dto = {
        title: 'New',
        author: 'Author',
        price: 10,
        description: 'Desc',
        categories: [],
      };
      const saved = { ...dto, id: 1 };
      mockBookRepository.create.mockReturnValue(saved);
      mockBookRepository.save.mockResolvedValue(saved);

      const result = await service.create(dto);
      expect(result).toEqual(saved);
      expect(mockRmqClient.emit).toHaveBeenCalledWith('book_created', saved);
    });
  });

  describe('updateReviewStats', () => {
    it('should update stats and emit book_updated', async () => {
      const mockBook = { id: 1, reviewCount: 2, averageRating: 4.0 };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.save.mockResolvedValue({
        ...mockBook,
        reviewCount: 3,
        averageRating: 4.5,
      });

      await service.updateReviewStats(1, 5.0);

      expect(mockBookRepository.save).toHaveBeenCalled();
      expect(mockRmqClient.emit).toHaveBeenCalledWith(
        'book_updated',
        expect.objectContaining({ reviewCount: 3 }),
      );
    });
  });
});
