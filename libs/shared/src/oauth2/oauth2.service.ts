import { Inject, Injectable } from '@nestjs/common';
import { fastifyOauth2 } from '@fastify/oauth2';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { MODULE_OPTIONS_TOKEN } from './oauth2.module-definition';
import { IUser, OAuth2ModuleOptions, VerifyAccessTokenResponse } from './types';
import { FastifyInstance } from 'fastify';
import { AsyncContext } from '@nestjs-steroids/async-context';

@Injectable()
export class OAuth2Service {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: OAuth2ModuleOptions,
    adapterHost: HttpAdapterHost,
    private ac: AsyncContext<string, IUser>,
  ) {
    const httpAdapter = adapterHost.httpAdapter;
    const fastify: FastifyInstance = httpAdapter.getInstance();

    fastify.register(fastifyOauth2, {
      name: 'customOauth2',
      credentials: {
        client: {
          id: options.client_id,
          secret: options.client_secret,
        },
        auth: {
          authorizeHost: options.host,
          tokenHost: options.host,
        },
      },
      startRedirectPath: '/login',
      callbackUri: options.host + '/login/callback',
      tokenRequestParams: {
        client_id: options.client_id,
        client_secret: options.client_secret,
      },
      scope: [],
    });

    fastify.get('/login/callback', async function (req, reply) {
      const oauth = (this as any).customOauth2;
      try {
        const token = await oauth.getAccessTokenFromAuthorizationCodeFlow(req);
        reply.send(token);
      } catch (error) {
        if (error.output?.statusCode) {
          return reply.status(error.output.statusCode).send(error.output.payload);
        }
        reply.status(500).send({ error: 'Server Error' });
      }
    });
  }

  async verifyToken(request: FastifyRequest): Promise<VerifyAccessTokenResponse | false> {
    let token: string;
    if (request.headers.authorization?.startsWith('Bearer')) {
      token = request.headers.authorization.split(' ')[1];
    } else {
      return false;
    }
    this.ac.register();
    try {
      const res = await fetch(this.options.host + '/oauth/verify', {
        method: 'POST',
        body: JSON.stringify({ access_token: token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        return false;
      }

      const verifyResult: VerifyAccessTokenResponse = await res.json();
      this.ac.set('user', verifyResult.user);

      return verifyResult;
    } catch (error) {
      return false;
    }
  }
}
