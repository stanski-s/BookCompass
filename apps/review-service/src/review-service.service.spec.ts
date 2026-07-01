import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReviewServiceService } from './review-service.service';
import { Review } from './review.entity';

describe('ReviewServiceService', () => {
  let service: ReviewServiceService;

  const mockRepository = {
    create: jest.fn().mockImplementation(
      (dto: Partial<Review>) =>
        ({
          ...dto,
          id: Date.now(),
          createdAt: new Date(),
        }) as Review,
    ),
    save: jest
      .fn()
      .mockImplementation((review: Review) => Promise.resolve(review)),
    find: jest.fn(),
  };

  const mockRmqClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewServiceService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockRepository,
        },
        {
          provide: 'RMQ_CLIENT',
          useValue: mockRmqClient,
        },
      ],
    }).compile();

    service = module.get<ReviewServiceService>(ReviewServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReview', () => {
    it('should save a new review and emit event', async () => {
      const dto = {
        bookId: 1,
        userId: 'user-uuid-1',
        rating: 5,
        comment: 'Great book!',
      };
      const result = await service.createReview(dto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        createdAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(result);
      expect(mockRmqClient.emit).toHaveBeenCalledWith('review_created', {
        bookId: dto.bookId,
        rating: dto.rating,
      });
      expect(result.rating).toBe(5);
    });
  });

  describe('getBookReviews', () => {
    it('should return an array of reviews for a given book', async () => {
      const bookId = 1;
      const expectedReviews = [
        { id: 1, bookId, userId: 'user-uuid-1', rating: 4, comment: 'Good' },
        {
          id: 2,
          bookId,
          userId: 'user-uuid-2',
          rating: 5,
          comment: 'Excellent',
        },
      ];
      mockRepository.find.mockResolvedValue(expectedReviews);

      const result = await service.getBookReviews(bookId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { bookId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(expectedReviews);
    });
  });
});
