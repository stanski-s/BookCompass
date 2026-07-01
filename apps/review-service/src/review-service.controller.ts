import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewServiceService } from './review-service.service';

@Controller()
export class ReviewServiceController {
  constructor(private readonly reviewServiceService: ReviewServiceService) {}

  @MessagePattern('add_review')
  async addReview(
    @Payload()
    data: {
      bookId: number;
      userId: number;
      rating: number;
      comment?: string;
    },
  ) {
    return this.reviewServiceService.createReview(data);
  }

  @MessagePattern('get_book_reviews')
  async getBookReviews(@Payload() data: { bookId: number }) {
    return this.reviewServiceService.getBookReviews(data.bookId);
  }
}
