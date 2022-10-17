import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../task.entity';
import { FindTasksQuery } from './quieries';

@QueryHandler(FindTasksQuery)
export class FindTasksHandler implements IQueryHandler<FindTasksQuery> {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async execute({ payload }: FindTasksQuery): Promise<any> {
    const tasks = await this.taskRepo.find({
      where: payload,
      relations: ['assignee'],
    });
    return { results: tasks };
  }
}
