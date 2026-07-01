import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Review } from './review.entity';

@Injectable()
export class ReviewServiceService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @Inject('RMQ_CLIENT')
    private rmqClient: ClientProxy,
  ) {}

  async createReview(data: {
    bookId: number;
    userId: string;
    rating: number;
    comment?: string;
  }) {
    const review = this.reviewRepository.create({
      ...data,
      createdAt: new Date(),
    });

    await this.reviewRepository.save(review);

    this.rmqClient.emit('review_created', {
      bookId: review.bookId,
      rating: review.rating,
    });

    return review;
  }

  async getBookReviews(bookId: number) {
    return this.reviewRepository.find({
      where: { bookId },
      order: { createdAt: 'DESC' },
    });
  }
}
