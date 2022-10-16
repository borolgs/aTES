import { Controller } from '@nestjs/common';
import { Auth } from '@shared/oauth2';
import { UsersService } from './users.service';

@Controller()
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
