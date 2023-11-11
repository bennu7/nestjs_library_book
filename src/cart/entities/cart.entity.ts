import { Entity, OneToOne, OneToMany, JoinColumn } from 'typeorm';

import { AbstractEntity } from '@/utils/abstract.entity';
import { User } from '@/user/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart extends AbstractEntity<Cart> {
  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  cart_items: CartItem[];
}
