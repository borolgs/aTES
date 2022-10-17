import { ForbiddenException, Logger } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafkaService } from '@shared/kafka';
import { Repository } from 'typeorm';
import { FindUsersResponse, IUser } from '../types';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private client: ClientKafkaService,
  ) {}

  async findAll(findParams?: Pick<IUser, 'name'>): Promise<FindUsersResponse> {
    let users: IUser[];
    if (!findParams) {
      users = await this.userRepo.find();
    } else {
      users = await this.userRepo.findBy(findParams);
    }
    return { results: users };
  }

  async create(args: Omit<IUser, 'publicId'>) {
    const user = await this.userRepo.findOneBy({ email: args.email });
    if (user) {
      throw new ForbiddenException(`Email ${args.email} already exists`);
    }
    const created = this.userRepo.create(args);
    await this.userRepo.save(created);
    await this.client.emit('account-stream', {
      name: 'AccountCreated',
      data: created,
    });
    this.logger.debug(`User ${created.email} created`);
    return created;
  }

  async findOne({ publicId }: Pick<IUser, 'publicId'>) {
    const user = await this.userRepo.findOneBy({ publicId });
    if (!user) {
      throw new NotFoundException(`User ${publicId} doesn't exist`);
    }
    return user;
  }

  async findOneById(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User doesn't exist`);
    }
    return user;
  }

  async findOneByEmail({ email }: Pick<IUser, 'email'>) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User ${email} doesn't exist`);
    }
    return user;
  }

  async update({ publicId, ...args }: Partial<IUser> & Pick<User, 'publicId'>) {
    const updated = await this.findOne({ publicId });
    await this.userRepo.save(Object.assign(updated, args));
    await this.client.emit('account-stream', {
      name: 'AccountUpdated',
      data: updated,
    });
    this.logger.debug(`User ${updated.email} updated`);
    return updated;
  }

  async delete({ publicId }: Pick<IUser, 'publicId'>) {
    const deleted = await this.findOne({ publicId });
    await this.userRepo.remove(deleted);
    await this.client.emit('account-stream', {
      name: 'AccountDeleted',
      data: deleted,
    });
    this.logger.debug(`User ${deleted.email} deleted`);
    return deleted;
  }
}
