import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from './review.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column('decimal')
  price!: number;

  @Column()
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(() => Review, (review) => review.book)
  reviews!: Review[];
}
