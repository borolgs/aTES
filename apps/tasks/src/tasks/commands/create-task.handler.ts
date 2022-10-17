import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { CreateTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { ClientKafkaService } from '@shared/kafka';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  private readonly logger = new Logger(CreateTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private client: ClientKafkaService,
  ) {}

  async execute({
    payload: { assigneeId, ...args },
  }: CreateTaskCommand): Promise<any> {
    let user: User | null = null;
    if (assigneeId) {
      user = await this.userRepo.findOneBy({ publicId: assigneeId });
    }

    if (!user) {
      user = await this.userRepo
        .createQueryBuilder('user')
        .select()
        .orderBy('random()')
        .getOne();
    }

    if (!user) {
      throw new NotFoundException('There is no users!');
    }

    const task = this.taskRepo.create({ ...args });
    task.assignee = user;
    await this.taskRepo.save(task);
    await this.userRepo.save(user);

    await this.client.emit('task', {
      name: 'TaskAssigned',
      data: {
        description: task.description,
        assigneeId: user.publicId,
      },
    });
    await this.client.emit('task-stream', {
      name: 'TaskCreated',
      data: task,
    });
    this.logger.debug(`Task ${task.description} created`);

    return task;
  }
}
