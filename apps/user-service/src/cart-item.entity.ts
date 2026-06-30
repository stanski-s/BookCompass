import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookId!: number;

  @Column({ default: 1 })
  quantity!: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  user!: User;
}
