import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { FindTransactionsParameters } from '../types';
import { ApplyPaymentCommand } from './commands';
import { FindTransactionsQuery } from './queries';

@Injectable()
export class AccountingService {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Cron('0 22 * * *')
  async doPayments() {
    const accounts = await this.userRepo.find();
    for (const account of accounts) {
      const accountBalance = account.balance;
      if (accountBalance > 0) {
        await this.commandBus.execute(new ApplyPaymentCommand({ accountId: account.publicId }));
      }
    }
  }

  async findTransactions(args: FindTransactionsParameters) {
    return this.queryBus.execute(new FindTransactionsQuery(args));
  }
}
