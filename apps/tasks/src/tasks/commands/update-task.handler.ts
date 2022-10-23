import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { UpdateTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { EventSchemaRegistryService } from '@shared/event-schema-registry';
import { TaskEvent } from '../events';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  private readonly logger = new Logger(UpdateTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private eventBus: EventBus,
    private schemaRegistry: EventSchemaRegistryService,
  ) {}

  async execute({ payload: { taskId, assigneeId, ...args } }: UpdateTaskCommand): Promise<any> {
    const task = await this.taskRepo.findOne({
      where: { publicId: taskId },
      relations: ['assignee'],
    });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} doesn't exist`);
    }

    let newAssignee: User | null = null;
    if (assigneeId && assigneeId !== task.assignee?.publicId) {
      newAssignee = await this.userRepo.findOneBy({ publicId: assigneeId });
      if (!newAssignee) {
        throw new NotFoundException(`User ${newAssignee} doesn't exist`);
      }
      task.assignee = newAssignee;
    }

    const isDone = args.status === 'done' && args.status !== task.status;

    await this.taskRepo.save(Object.assign(task, args));

    if (isDone) {
      await TaskEvent.createTaskCompletedEvent('task', {
        taskId: task.publicId,
        description: task.description,
        assigneeId: task.assignee!.publicId,
      })
        .andThen((event) => this.schemaRegistry.validate(event, 'tasks.completed', 1))
        .mapErr((err) => this.logger.error(err.message, err.validationErrors))
        .asyncMap((event) => this.eventBus.publish(event));

      this.logger.debug(`Task ${task.description} completed`);
    } else if (newAssignee) {
      await this.userRepo.save(newAssignee);
      await TaskEvent.createTaskAssignedEvent('task', {
        taskId: task.publicId,
        description: task.description,
        assigneeId: newAssignee.publicId,
      })
        .andThen((event) => this.schemaRegistry.validate(event, 'tasks.assigned', 1))
        .mapErr((err) => this.logger.error(err.message, err.validationErrors))
        .asyncMap((event) => this.eventBus.publish(event));

      this.logger.debug(`Task ${task.description} assigned`);
    }

    await TaskEvent.createTaskUpdatedEvent('task-stream', task)
      .andThen((event) => this.schemaRegistry.validate(event.event, 'tasks.updated', 1).map(() => event))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .asyncMap((event) => this.eventBus.publish(event));

    this.logger.debug(`Task ${task.description} updated`);

    return task;
  }
}
