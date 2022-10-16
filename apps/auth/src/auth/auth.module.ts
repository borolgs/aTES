import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ClientAppsModule } from '../client-apps';

@Module({
  imports: [UsersModule, ClientAppsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
