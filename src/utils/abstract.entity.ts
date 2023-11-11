import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }
}
