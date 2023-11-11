import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Cart } from './cart.entity';
import { Book } from 'src/book/entities/book.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';

@Entity()
export class CartItem extends AbstractEntity<CartItem> {
  @ManyToOne(() => Cart, (cart) => cart.cart_items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Book, (book) => book.cart_items)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column()
  quantity: number;
}
