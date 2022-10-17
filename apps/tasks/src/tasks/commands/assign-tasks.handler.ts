import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { User } from '../../users';
import { AssignTasksCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { ClientKafkaService } from '@shared/kafka';

@CommandHandler(AssignTasksCommand)
export class AssignTasksHandler implements ICommandHandler<AssignTasksCommand> {
  private readonly logger = new Logger(AssignTasksHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
    private client: ClientKafkaService,
  ) {}

  async execute(args: AssignTasksCommand): Promise<any> {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .select()
      .orderBy('random()')
      .getMany();

    const notCompletedTasks = await this.taskRepo
      .createQueryBuilder('task')
      .where('task.status <> :status', { status: 'done' })
      .leftJoinAndSelect('task.assignee', 'assignee')
      .orderBy('random()')
      .getMany();

    const tasksDict = {};
    const messages: any[] = [];

    await this.dataSource.transaction(async (manager) => {
      while (notCompletedTasks.length) {
        const randomTaskIdx = Math.floor(
          Math.random() * notCompletedTasks.length,
        );
        const randomUserIdx = Math.floor(Math.random() * users.length);

        const task = notCompletedTasks[randomTaskIdx];
        notCompletedTasks.splice(randomTaskIdx, 1);
        const user = users[randomUserIdx];

        Object.assign(task, { assignee: user });

        await manager.save(task);
        await manager.save(user);

        messages.push({
          name: 'TaskAssigned',
          data: {
            description: task.description,
            assigneeId: user.publicId,
          },
        });

        if (tasksDict[user.publicId]) {
          tasksDict[user.publicId].push(task.publicId);
        } else {
          tasksDict[user.publicId] = [task.publicId];
        }
      }
    });

    await this.client.emitMutliple('task', messages);

    this.logger.debug('Assign free tasks');

    return tasksDict;
  }
}
