import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';

import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { AbstractEntity } from 'src/utils/abstract.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  user_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ enum: ['admin', 'user'] })
  role: string;

  @OneToOne(() => Cart, { cascade: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Order[];
}
