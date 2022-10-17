import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../tasks';
import { IUser, userRoles, UserRoleType } from '../types';

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

  @Column({
    type: 'enum',
    enum: userRoles,
    default: 'user',
  })
  role: UserRoleType;

  @OneToMany(() => Task, (task) => task.assignee, { cascade: ['remove'] })
  tasks: Task[];

  toJSON(): IUser {
    return {
      publicId: this.publicId,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
