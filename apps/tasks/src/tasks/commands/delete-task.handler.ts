import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { DeleteTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { ClientKafkaService } from '@shared/kafka';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  private readonly logger = new Logger(DeleteTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private client: ClientKafkaService,
  ) {}

  async execute({ payload: { taskId } }: DeleteTaskCommand): Promise<any> {
    const deleted = await this.taskRepo.findOneBy({ publicId: taskId });
    if (!deleted) {
      throw new NotFoundException(`Task ${taskId} doesn't exist`);
    }
    await this.taskRepo.remove(deleted);
    await this.client.emit('task-stream', {
      name: 'TaskDeleted',
      data: deleted,
    });
    this.logger.debug(`Task ${deleted.description} deleted`);
    return deleted;
  }
}
