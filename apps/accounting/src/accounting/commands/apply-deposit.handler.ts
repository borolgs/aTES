import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, User } from '../../entities';
import { ApplyDepositCommand } from './accounting.commands';

@CommandHandler(ApplyDepositCommand)
export class ApplyDepositHandler implements ICommandHandler<ApplyDepositCommand> {
  private readonly logger = new Logger(ApplyDepositHandler.name);
  constructor(
    @InjectRepository(Transaction) private transactionsRepo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async execute({ payload: { accountId, description, value } }: ApplyDepositCommand): Promise<any> {
    const account = await this.userRepo.findOneBy({ publicId: accountId });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} doesn't exists`);
    }

    let transaction: any;
    await this.dataSource.transaction(async (manager) => {
      transaction = this.transactionsRepo.create({
        description,
        debit: value,
        credit: 0,
      });
      transaction.account = account;
      await manager.save(transaction);
      account.balance -= value;
      await manager.save(account);
    });

    this.logger.debug(`Deposit transaction created: ${transaction.id}`);
    return transaction;
  }
}
