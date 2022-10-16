import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClientApplication {
  @PrimaryGeneratedColumn()
  id: number;
}
