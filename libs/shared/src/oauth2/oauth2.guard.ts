import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { OAuth2Service } from './oauth2.service';

@Injectable()
export class OAuth2Guard implements CanActivate {
  constructor(
    private readonly service: OAuth2Service,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const result = await this.service.verifyToken(request);

    if (!result) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    if (!roles.includes(result.user.role)) {
      return false;
    }

    return true;
  }
}
