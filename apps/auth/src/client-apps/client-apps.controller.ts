import { Controller } from '@nestjs/common';
import { Auth } from '@shared/oauth2';
import { ClientAppsService } from './client-apps.service';

@Controller()
@Auth()
export class ClientAppsController {
  constructor(private readonly appsService: ClientAppsService) {}
}
