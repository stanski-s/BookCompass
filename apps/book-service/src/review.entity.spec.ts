import { Review } from './review.entity';
import { CreateReviewDto } from './create-review.dto';

describe('Review Domain', () => {
  it('should create a review entity', () => {
    const review = new Review();
    review.id = 1;
    review.rating = 5;
    review.content = 'Awesome book!';
    expect(review.rating).toBe(5);
    expect(review.content).toBe('Awesome book!');
  });

  it('should create a review DTO', () => {
    const dto = new CreateReviewDto();
    dto.rating = 5;
    dto.content = 'Awesome book!';
    dto.bookId = 1;
    expect(dto.rating).toBe(5);
    expect(dto.content).toBe('Awesome book!');
    expect(dto.bookId).toBe(1);
  });
});
