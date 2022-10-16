import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EditApplicationParameters,
  IClientApplication,
  RegisterApplicationParameters,
} from '../types';
import { ClientApplication } from './client-app.entity';

@Injectable()
export class ClientAppsService {
  constructor(
    @InjectRepository(ClientApplication)
    private appsRepo: Repository<ClientApplication>,
  ) {}

  async findAll(): Promise<any> {
    const apps = await this.appsRepo.find();
    return { results: apps };
  }

  async create(args: RegisterApplicationParameters) {
    const created = this.appsRepo.create(args);
    await this.appsRepo.save(created);
    return created;
  }

  async findOne({ clientId }: Pick<IClientApplication, 'clientId'>) {
    const user = await this.appsRepo.findOneBy({ clientId });
    if (!user) {
      throw new NotFoundException(`App ${clientId} doesn't exist`);
    }
    return user;
  }

  async update({ clientId, ...args }: EditApplicationParameters) {
    const updated = await this.findOne({ clientId });
    await this.appsRepo.save(Object.assign(updated, args));
    return updated;
  }

  async delete({ clientId }: Pick<IClientApplication, 'clientId'>) {
    const deleted = await this.findOne({ clientId });
    return this.appsRepo.remove(deleted);
  }
}
