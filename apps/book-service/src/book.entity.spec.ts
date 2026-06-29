import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';

describe('Book Domain', () => {
  it('should create a book entity', () => {
    const book = new Book();
    book.id = 1;
    book.title = 'Test Title';
    expect(book.title).toBe('Test Title');
  });

  it('should create a DTO', () => {
    const dto = new CreateBookDto();
    dto.title = 'Test Title';
    expect(dto.title).toBe('Test Title');
  });
});
