import { UseGuards, SetMetadata } from '@nestjs/common';
import { OAuth2Guard } from './oauth2.guard';
import { UserRoleType } from './types';

export const Auth = () => UseGuards(OAuth2Guard);

export const Roles = (...roles: UserRoleType[]) => SetMetadata('roles', roles);
