import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { CartItem } from 'src/api/cart/entities/cart-item.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';

@Entity()
export class Book extends AbstractEntity<Book> {
  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  ISBN: string;

  @Column()
  available_quantity: number;

  @Column()
  price: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.book, {
    cascade: true,
  })
  cart_items: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
