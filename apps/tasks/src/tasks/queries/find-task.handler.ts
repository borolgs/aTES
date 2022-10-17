import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../task.entity';
import { FindTaskQuery } from './quieries';

@QueryHandler(FindTaskQuery)
export class FindTaskHandler implements IQueryHandler<FindTaskQuery> {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async execute({ payload: { taskId } }: FindTaskQuery): Promise<any> {
    const task = await this.taskRepo.findOneBy({ publicId: taskId });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} doesn't exist`);
    }
    return task;
  }
}
