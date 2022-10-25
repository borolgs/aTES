import { Entity, Column, PrimaryGeneratedColumn, Generated, ManyToOne } from 'typeorm';
import { ITask, TaskStatus, taskStatuses } from '../types';
import { User } from '../users';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  publicId: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  jiraId: string;

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
      title: this.title,
      jiraId: this.jiraId,
      description: this.description,
      status: this.status,
      assignee: this.assignee,
    };
  }
}
