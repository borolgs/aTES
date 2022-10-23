import { IQuery } from '@shared/cqrs';
import { FindTransactionsParameters } from '../../types';

export class FindTransactionsQuery implements IQuery<FindTransactionsParameters> {
  constructor(public payload: FindTransactionsParameters) {}
}
