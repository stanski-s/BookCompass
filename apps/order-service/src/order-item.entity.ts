import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookId!: number;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;
}
