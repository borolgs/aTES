import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, User } from '../entities';
import { TaskCUDEvent } from '../types';

@Injectable()
export class TaskConsumerService {
  private logger = new Logger(TaskConsumerService.name);

  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
  async consume(event: TaskCUDEvent) {
    switch (event.eventName) {
      case 'TaskCreated':
        {
          const { assignee: assignee, ...data } = event.data;
          const created = this.taskRepo.create(data);
          if (assignee) {
            const user = await this.userRepo.findOneBy({ publicId: assignee.publicId });
            if (user) {
              created.assignee = user;
              await this.userRepo.save(user);
            }
          }
          await this.taskRepo.save(created);
          this.logger.debug(`Task ${created.description} created`);
        }
        break;
      case 'TaskUpdated':
        let task = await this.taskRepo.findOneBy({
          publicId: event.data.publicId,
        });
        const { assignee, ...data } = event.data;
        if (!task) {
          task = this.taskRepo.create(data);
          if (assignee) {
            const user = await this.userRepo.findOneBy({ publicId: assignee.publicId });
            if (user) {
              task.assignee = user;
              await this.userRepo.save(user);
            }
          }
          await this.taskRepo.save(task);
          this.logger.debug(`Task ${task.description} created`);
        } else {
          if (assignee && task.assignee?.publicId !== assignee?.publicId) {
            const user = await this.userRepo.findOneBy({ publicId: assignee.publicId });
            if (user) {
              task.assignee = user;
              await this.userRepo.save(user);
            }
          }
          await this.taskRepo.save(Object.assign(task, data));
          this.logger.debug(`Task ${task.description} updated`);
        }
        break;
      case 'TaskDeleted':
        const deleted = await this.taskRepo.findOne({
          where: {
            publicId: event.data.publicId,
          },
          relations: ['assignee'],
        });
        if (deleted) {
          await this.taskRepo.remove(deleted);
          this.logger.debug(`Task ${deleted.description} deleted`);
        }
        break;
      default:
        break;
    }
  }
}
