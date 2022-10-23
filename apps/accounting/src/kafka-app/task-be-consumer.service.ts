import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplyDepositCommand, ApplyWithdrawCommand } from '../accounting/commands';
import { Task } from '../entities';
import { TaskAssignEvent } from '../types';

@Injectable()
export class TaskBEConsumerService {
  private logger = new Logger(TaskBEConsumerService.name);

  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>, private commandBus: CommandBus) {}
  async consume(events: TaskAssignEvent[]) {
    // WAIT CUD :D
    await new Promise((resolve) => setTimeout(resolve, 1000));

    for (const event of events) {
      switch (event.eventName) {
        case 'TaskAssigned':
          {
            const { taskId, assigneeId } = event.data;
            const task = await this.taskRepo.findOneBy({ publicId: taskId });
            const description = `Deposit transaction for task ${task!.description}`;

            await this.commandBus.execute(
              new ApplyDepositCommand({
                accountId: assigneeId,
                value: task!.price,
                description,
              }),
            );
          }
          break;
        case 'TaskCompleted':
          {
            const { taskId, assigneeId } = event.data;
            const task = await this.taskRepo.findOneBy({ publicId: taskId });
            const description = `Withdraw transaction for task ${task!.description}`;

            await this.commandBus.execute(
              new ApplyWithdrawCommand({
                accountId: assigneeId,
                value: task!.price,
                description,
              }),
            );
          }
          break;
        default:
          break;
      }
    }
  }
}
