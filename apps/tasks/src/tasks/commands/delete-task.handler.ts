import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { DeleteTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { TaskEvent } from '../events';
import { EventSchemaRegistryService } from '@shared/event-schema-registry';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  private readonly logger = new Logger(DeleteTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private eventBus: EventBus,
    private schemaRegistry: EventSchemaRegistryService,
  ) {}

  async execute({ payload: { taskId } }: DeleteTaskCommand): Promise<any> {
    const deleted = await this.taskRepo.findOneBy({ publicId: taskId });
    if (!deleted) {
      throw new NotFoundException(`Task ${taskId} doesn't exist`);
    }
    await this.taskRepo.remove(deleted);

    await TaskEvent.createTaskDeletedEvent('task-stream', deleted)
      .andThen((event) => this.schemaRegistry.validate(event, 'tasks.deleted', 1))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .asyncMap((event) => this.eventBus.publish(event));

    this.logger.debug(`Task ${deleted.description} deleted`);
    return deleted;
  }
}
