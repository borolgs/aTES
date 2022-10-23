import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entities';
import { FindTransactionsQuery } from './accounting.queries';

@QueryHandler(FindTransactionsQuery)
export class FindTransactionsHandler implements IQueryHandler<FindTransactionsQuery> {
  constructor(@InjectRepository(Transaction) private trRepo: Repository<Transaction>) {}

  async execute({ payload }: FindTransactionsQuery): Promise<any> {
    const query: Record<string, any> = {};
    if (payload.accountId) {
      query.account = { publicId: payload.accountId };
    }
    const transactions = await this.trRepo.find({
      where: query,
      relations: ['account'],
    });
    return { results: transactions };
  }
}
