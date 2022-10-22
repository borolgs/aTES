import { Entity, Column, PrimaryGeneratedColumn, Generated, ManyToOne, BaseEntity, BeforeInsert } from 'typeorm';
import { ITask } from '../types';
import { User } from '../users';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  publicId: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  assignee: User | null;

  @Column('bigint', { default: 0 })
  price: number;

  @Column('bigint', { default: 0 })
  fee: number;

  toJSON(): ITask {
    return {
      publicId: this.publicId,
      description: this.description,
      assignee: this.assignee,
    };
  }

  @BeforeInsert()
  async beforeInsert() {
    this.price = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
    this.fee = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
  }
}
