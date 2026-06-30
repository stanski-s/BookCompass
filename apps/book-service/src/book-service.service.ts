import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookServiceService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @Inject('RMQ_CLIENT')
    private readonly rmqClient: ClientProxy,
  ) {}

  getHealth(): string {
    return 'book-service is healthy!';
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    const savedBook = await this.bookRepository.save(book);
    this.rmqClient.emit('book_created', savedBook);
    return savedBook;
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async getBestsellers(): Promise<Book[]> {
    return this.bookRepository.find({
      take: 4,
      order: {
        id: 'ASC', // Placeholder logic for bestsellers
      },
    });
  }

  async findById(id: number): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
    });
  }
}
