import { Controller } from '@nestjs/common';
import { AccountingService } from './accounting.service';

@Controller()
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}
}
