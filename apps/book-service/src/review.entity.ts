import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  rating!: number;

  @Column({ type: 'text' })
  content!: string;

  @ManyToOne(() => Book, (book) => book.reviews)
  book!: Book;
}
