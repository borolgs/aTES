import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  BaseEntity,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { IUser, userRoles, UserRoleType } from '../types';

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  publicId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: userRoles,
    default: 'user',
  })
  role: UserRoleType;

  toJSON(): IUser {
    return {
      publicId: this.publicId,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  @BeforeInsert()
  async beforeInsert() {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.password, salt);
    this.password = passwordHash;
  }

  async matchPassword(enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
  }
}
