import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users';
import { UpdateTaskCommand } from './tasks.commands';
import { Task } from '../task.entity';
import { ClientKafkaService } from '@shared/kafka';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  private readonly logger = new Logger(UpdateTaskHandler.name);
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,

    @InjectRepository(User) private userRepo: Repository<User>,
    private client: ClientKafkaService,
  ) {}

  async execute({
    payload: { taskId, assigneeId, ...args },
  }: UpdateTaskCommand): Promise<any> {
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
    }

    const isDone = args.status === 'done' && args.status !== task.status;

    await this.taskRepo.save(Object.assign(task, args));

    if (isDone) {
      await this.client.emit('task', {
        name: 'TaskCompleted',
        data: {
          description: task.description,
          assigneeId: task.assignee?.publicId,
        },
      });
      this.logger.debug(`Task ${task.description} completed`);
    } else if (newAssignee) {
      await this.client.emit('task', {
        name: 'TaskAssigned',
        data: {
          description: task.description,
          assigneeId: newAssignee.publicId,
        },
      });
      this.logger.debug(`Task ${task.description} assigned`);
    }

    await this.client.emit('task-stream', {
      name: 'TaskUpdated',
      data: task,
    });

    this.logger.debug(`Task ${task.description} updated`);

    return task;
  }
}
