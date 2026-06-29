import { Book } from './book.entity';
import { CreateBookDto } from './create-book.dto';

describe('Book Domain', () => {
  it('should create a book entity', () => {
    const book = new Book();
    book.id = 1;
    book.title = 'Test Title';
    book.categories = ['Fantasy'];
    book.description = 'Test Description';
    expect(book.title).toBe('Test Title');
    expect(book.categories).toEqual(['Fantasy']);
    expect(book.description).toBe('Test Description');
  });

  it('should create a DTO', () => {
    const dto = new CreateBookDto();
    dto.title = 'Test Title';
    dto.categories = ['Fantasy'];
    dto.description = 'Test Description';
    expect(dto.title).toBe('Test Title');
    expect(dto.categories).toEqual(['Fantasy']);
    expect(dto.description).toBe('Test Description');
  });
});
