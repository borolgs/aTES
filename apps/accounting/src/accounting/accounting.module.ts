import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesModule } from '../entities';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { ApplyDepositHandler, ApplyPaymentHandler, ApplyWithdrawHandler } from './commands';
import { FindTransactionsHandler } from './queries';

@Module({
  imports: [CqrsModule, TypeOrmModule, EntitiesModule],
  controllers: [AccountingController],
  providers: [
    ApplyDepositHandler,
    ApplyWithdrawHandler,
    ApplyPaymentHandler,
    FindTransactionsHandler,
    AccountingService,
  ],
})
export class AccountingModule {}
