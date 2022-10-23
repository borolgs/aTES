import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { CreateTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { TaskEvent } from '../events';
import { EventSchemaRegistryService } from '@shared/event-schema-registry';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger(CreateTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private eventBus: EventBus,
    private schemaRegistry: EventSchemaRegistryService,
  ) {}

  async execute({ payload: { assigneeId, ...args } }: CreateTaskCommand): Promise<any> {
    let user: User | null = null;
    if (assigneeId) {
      user = await this.userRepo.findOneBy({ publicId: assigneeId });
    }

    if (!user) {
      user = await this.userRepo.createQueryBuilder('user').select().orderBy('random()').getOne();
    }

    if (!user) {
      throw new NotFoundException('There is no users!');
    }

    const task = this.taskRepo.create({ ...args });
    task.assignee = user;
    await this.taskRepo.save(task);
    await this.userRepo.save(user);

    const taskAssigned = {
      taskId: task.publicId,
      description: task.description,
      assigneeId: user.publicId,
    };

    await TaskEvent.createTaskAssignedEvent('task', taskAssigned)
      .andThen((event) => this.schemaRegistry.validate(event, 'tasks.assigned', 1))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .asyncMap((event) => this.eventBus.publish(event));

    await TaskEvent.createTaskCreatedEventV2('task-stream', task)
      .andThen((event) => this.schemaRegistry.validate(event.event, 'tasks.created', 2).map(() => event))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .asyncMap((event) => this.eventBus.publish(event));

    this.logger.debug(`Task ${task.description} created`);

    return task;
  }
}
