import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../users';
import { AssignTasksCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { ClientKafkaService } from '@shared/kafka';
import { EventSchemaRegistryService } from '@shared/event-schema-registry';
import { TaskEvent } from '../events';

@CommandHandler(AssignTasksCommand)
export class AssignTasksHandler implements ICommandHandler<AssignTasksCommand> {
  private readonly logger = new Logger(AssignTasksHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    private client: ClientKafkaService,
    private eventBus: EventBus,
    private schemaRegistry: EventSchemaRegistryService,
  ) {}

  async execute(args: AssignTasksCommand): Promise<any> {
    const users = await this.userRepo.createQueryBuilder('user').select().orderBy('random()').getMany();

    const notCompletedTasks = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.status <> :status', { status: 'done' })
      .leftJoinAndSelect('task.assignee', 'assignee')
      .orderBy('random()')
      .getMany();

    const tasksDict = {};
    const events: any[] = [];

    await this.dataSource.transaction(async (manager) => {
      while (notCompletedTasks.length) {
        const randomTaskIdx = Math.floor(Math.random() * notCompletedTasks.length);
        const randomUserIdx = Math.floor(Math.random() * users.length);

        const task = notCompletedTasks[randomTaskIdx];
        notCompletedTasks.splice(randomTaskIdx, 1);
        const user = users[randomUserIdx];

        Object.assign(task, { assignee: user });

        await manager.save(task);
        await manager.save(user);

        TaskEvent.createTaskAssignedEvent('task', {
          description: task.description,
          assigneeId: user.publicId,
        }).map(({ event }) => events.push(event));

        if (tasksDict[user.publicId]) {
          tasksDict[user.publicId].push(task.publicId);
        } else {
          tasksDict[user.publicId] = [task.publicId];
        }
      }
    });

    if (events[0]) {
      await this.schemaRegistry
        .validate(events[0], 'tasks.assigned', 1)
        .mapErr((err) => this.logger.error(err.message, err.validationErrors))
        .asyncMap(() => this.client.emitMutliple('task', events));
    }

    this.logger.debug('Assign free tasks');

    return tasksDict;
  }
}
