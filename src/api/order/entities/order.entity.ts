import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from 'src/utils/abstract.entity';
import { User } from 'src/api/user/entities/user.entity';

@Entity()
export class Order extends AbstractEntity<Order> {
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  total_amount: number;

  @Column({ enum: ['pending', 'completed'] })
  status: string;

  @Column()
  order_date: Date;
}
