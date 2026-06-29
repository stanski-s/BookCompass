import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';
import { Review } from './review.entity';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class BookServiceService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  getHealth(): string {
    return 'book-service is healthy!';
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async addReview(
    bookId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      book: { id: bookId },
    });
    return this.reviewRepository.save(review);
  }
}
