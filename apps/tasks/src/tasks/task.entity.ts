import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
} from 'typeorm';
import { ITask, TaskStatus, taskStatuses } from '../types';
import { User } from '../users';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  publicId: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: taskStatuses,
    default: 'todo',
  })
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  assignee: User | null;

  toJSON(): ITask {
    return {
      publicId: this.publicId,
      description: this.description,
      status: this.status,
      assignee: this.assignee,
    };
  }
}
