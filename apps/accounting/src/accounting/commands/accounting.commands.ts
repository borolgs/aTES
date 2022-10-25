import { ICommand } from '@shared/cqrs';
import { DepositParameters, PaymentParameters, WithdrawParameters } from '../../types';

export class ApplyDepositCommand implements ICommand<DepositParameters> {
  constructor(public payload: DepositParameters) {}
}

export class ApplyWithdrawCommand implements ICommand<WithdrawParameters> {
  constructor(public payload: WithdrawParameters) {}
}

export class ApplyPaymentCommand implements ICommand<PaymentParameters> {
  constructor(public payload: PaymentParameters) {}
}
