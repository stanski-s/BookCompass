import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class LikedBook {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookId!: number;

  @ManyToOne(() => User, (user) => user.likedBooks, { onDelete: 'CASCADE' })
  user!: User;
}
