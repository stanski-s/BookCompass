import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';

describe('Book Domain', () => {
  it('should create a book entity', () => {
    const book = new Book();
    book.id = 1;
    book.title = 'Test Title';
    book.category = 'Fantasy';
    book.description = 'A great book';
    expect(book.title).toBe('Test Title');
    expect(book.category).toBe('Fantasy');
    expect(book.description).toBe('A great book');
  });

  it('should create a DTO', () => {
    const dto = new CreateBookDto();
    dto.title = 'Test Title';
    dto.category = 'Fantasy';
    dto.description = 'A great book';
    expect(dto.title).toBe('Test Title');
    expect(dto.category).toBe('Fantasy');
    expect(dto.description).toBe('A great book');
  });
});
