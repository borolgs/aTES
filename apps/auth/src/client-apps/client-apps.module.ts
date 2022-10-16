import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientApplication } from './client-app.entity';
import { ClientAppsController } from './client-apps.controller';
import { ClientAppsService } from './client-apps.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientApplication])],
  controllers: [ClientAppsController],
  providers: [ClientAppsService],
  exports: [ClientAppsService],
})
export class ClientAppsModule {}
