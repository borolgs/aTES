import { AsyncContext } from '@nestjs-steroids/async-context';
import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { Auth } from '@shared/oauth2';
import { IUser } from '@shared/oauth2/types';
import { AccountingService } from './accounting.service';

@Controller()
@Auth()
export class AccountingController {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly asyncContext: AsyncContext<string, any>,
  ) {}

  @Get('/transactions')
  findTransactions(@Query('accountId') accountId: string) {
    const user: IUser = this.asyncContext.get('user');
    if (user.role === 'user' && accountId !== user.publicId) {
      return new ForbiddenException();
    }
    return this.accountingService.findTransactions({ accountId });
  }
}
