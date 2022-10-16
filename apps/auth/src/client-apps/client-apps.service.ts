import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientApplication } from './client-app.entity';

@Injectable()
export class ClientAppsService {
  constructor(
    @InjectRepository(ClientApplication)
    private appsRepo: Repository<ClientApplication>,
  ) {}
}
