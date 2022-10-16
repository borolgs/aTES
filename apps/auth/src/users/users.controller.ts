import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth, Roles } from '@shared/oauth2';
import { RegisterParameters } from '../types';
import { UsersService } from './users.service';

@Controller()
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/accounts')
  @Roles('admin', 'manager')
  findAccounts() {
    return this.usersService.findAll();
  }

  @Post('/accounts')
  @Roles('admin')
  createAccount(@Body() args: RegisterParameters) {
    return this.usersService.create(args);
  }

  @Patch('/accounts/:id')
  @Roles('admin')
  editAccount(@Param('id') id: string, @Body() args: any) {
    return this.usersService.update({ publicId: id, ...args });
  }

  @Delete('/accounts/:id')
  @Roles('admin')
  deleteAccount(@Param('id') id: string) {
    return this.usersService.delete({ publicId: id });
  }
}
