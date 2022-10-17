import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth, Roles } from '@shared/oauth2';
import { RegisterApplicationParameters } from '../types';
import { ClientAppsService } from './client-apps.service';

@Controller()
@Auth()
export class ClientAppsController {
  constructor(private readonly appsService: ClientAppsService) {}

  @Get('/apps')
  @Roles('admin')
  findApps() {
    return this.appsService.findAll();
  }

  @Post('/apps')
  @Roles('admin')
  registerApp(@Body() args: RegisterApplicationParameters) {
    return this.appsService.create(args);
  }
}
