import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text', { array: true, default: '{}' })
  categories!: string[];

  @Column({ nullable: true })
  coverUrl!: string;

  @Column({ type: 'text' })
  description!: string;
}
