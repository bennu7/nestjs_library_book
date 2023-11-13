import { Entity, OneToOne, OneToMany, JoinColumn } from 'typeorm';

import { AbstractEntity } from 'src/utils/abstract.entity';
import { CartItem } from './cart-item.entity';
import { User } from 'src/api/user/entities/user.entity';

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
