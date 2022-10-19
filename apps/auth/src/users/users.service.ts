import { BadRequestException, Logger } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSchemaRegistryService } from '@shared/event-schema-registry';
import { ClientKafkaService } from '@shared/kafka';
import { Repository } from 'typeorm';
import { FindUsersResponse, IUser } from '../types';
import { User } from './users.entity';
import { UserEvent } from './events/users.events';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private schemaRegistry: EventSchemaRegistryService,
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
      throw new BadRequestException(`Email ${args.email} already exists`);
    }

    const created = this.userRepo.create(args);
    await this.userRepo.save(created);

    await UserEvent.createUserCreatedEvent('account-stream', created)
      .andThen((event) => this.schemaRegistry.validate(event, 'accounts.created', 1))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .map((e) => e as UserEvent<IUser>)
      .asyncMap(({ topic, event }) => {
        return this.client.emit(topic, event);
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

    await UserEvent.createUserUpdatedEvent('account-stream', updated)
      .andThen((event) => this.schemaRegistry.validate(event, 'accounts.updated', 1))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .map((e) => e as UserEvent<IUser>)
      .asyncMap(({ topic, event }) => {
        return this.client.emit(topic, event);
      });

    this.logger.debug(`User ${updated.email} updated`);
    return updated;
  }

  async delete({ publicId }: Pick<IUser, 'publicId'>) {
    const deleted = await this.findOne({ publicId });
    await this.userRepo.remove(deleted);

    await UserEvent.createUserDeletedEvent('account-stream', deleted)
      .andThen((event) => this.schemaRegistry.validate(event, 'accounts.deleted', 1))
      .mapErr((err) => this.logger.error(err.message, err.validationErrors))
      .map((e) => e as UserEvent<IUser>)
      .asyncMap(({ topic, event }) => {
        return this.client.emit(topic, event);
      });

    this.logger.debug(`User ${deleted.email} deleted`);
    return deleted;
  }
}
