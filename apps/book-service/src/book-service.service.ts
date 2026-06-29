import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookServiceService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
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
}
