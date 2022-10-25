import { Entity, Column, PrimaryGeneratedColumn, Generated, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ITransaction } from '../types';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  publicId: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.transactions, { nullable: true })
  account: User;

  @Column('integer', {
    default: 0,
  })
  credit: number;

  @Column('integer', { default: 0 })
  debit: number;

  toJSON(): ITransaction {
    return {
      publicId: this.publicId,
      description: this.description,
      account: this.account,
      credit: this.credit,
      debit: this.debit,
    };
  }
}
