import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { LikedBook } from './liked-book.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ nullable: true })
  bio!: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems!: CartItem[];

  @OneToMany(() => LikedBook, (likedBook) => likedBook.user)
  likedBooks!: LikedBook[];
}
