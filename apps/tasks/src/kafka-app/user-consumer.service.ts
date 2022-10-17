import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks';
import { UserCreatedEvent } from '../types';
import { User } from '../users';

@Injectable()
export class UsersConsumerService {
  private logger = new Logger(UsersConsumerService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}
  async consume(event: UserCreatedEvent) {
    switch (event.name) {
      case 'AccountCreated':
        const created = this.userRepo.create(event.data);
        await this.userRepo.save(created);
        this.logger.debug(`User ${created.email} created`);
        break;
      case 'AccountUpdated':
        let user = await this.userRepo.findOneBy({
          publicId: event.data.publicId,
        });
        if (!user) {
          user = this.userRepo.create(event.data);
          await this.userRepo.save(user);
          this.logger.debug(`User ${user.email} created`);
        } else {
          await this.userRepo.save(Object.assign(user, event.data));
          this.logger.debug(`User ${user.email} updated`);
        }
        break;
      case 'AccountDeleted':
        const deleted = await this.userRepo.findOne({
          where: {
            publicId: event.data.publicId,
          },
          relations: ['tasks'],
        });
        if (deleted) {
          for (const task of deleted.tasks) {
            task.assignee = null;
            this.taskRepo.save(task);
          }
          await this.userRepo.remove(deleted);
          this.logger.debug(`User ${deleted.email} deleted`);
        }
        break;
      default:
        break;
    }
  }
}
