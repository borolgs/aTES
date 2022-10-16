import { Injectable } from '@nestjs/common';
import { UsersService } from '../users';
import { ClientAppsService } from '../client-apps';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly appsService: ClientAppsService,
  ) {}
}
