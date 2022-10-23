import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { Transaction } from './transaction.entity';
import { IUser } from '../types';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  publicId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Task, (task) => task.assignee, { cascade: ['remove'] })
  tasks: Task[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  @Column('integer', { default: 0 })
  balance: number;

  toJSON(): IUser {
    return {
      publicId: this.publicId,
      name: this.name,
      email: this.email,
    };
  }
}
