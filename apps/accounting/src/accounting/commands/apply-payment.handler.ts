import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction, User } from '../../entities';
import { ApplyPaymentCommand } from './accounting.commands';

@CommandHandler(ApplyPaymentCommand)
export class ApplyPaymentHandler implements ICommandHandler<ApplyPaymentCommand> {
  private readonly logger = new Logger(ApplyPaymentHandler.name);
  constructor(
    @InjectRepository(Transaction) private transactionsRepo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async execute({ payload: { accountId } }: ApplyPaymentCommand): Promise<any> {
    const account = await this.userRepo.findOneBy({ publicId: accountId });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} doesn't exists`);
    }
    let transaction: any;
    await this.dataSource.transaction(async (manager) => {
      transaction = this.transactionsRepo.create({
        description: `Payment transaction for account ${account.email} ${account.publicId}`,
        debit: account.balance,
        credit: 0,
      });
      transaction.account = account;
      await manager.save(transaction);
      account.balance = 0;
      await manager.save(account);
    });

    this.logger.debug(`Payment transaction created: ${transaction.id}`);
    return transaction;
  }
}
