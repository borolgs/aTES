import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';
import { IClientApplication } from '../types';

@Entity()
export class ClientApplication implements IClientApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  baseUrl: string;
  @Column()
  callbackUrl: string;

  @Column()
  @Generated('uuid')
  clientId: string;
  @Column()
  @Generated('uuid')
  clientSecret: string;

  toJSON(): IClientApplication {
    return {
      name: this.name,
      baseUrl: this.baseUrl,
      callbackUrl: this.callbackUrl,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    };
  }
}
