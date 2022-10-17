import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GetAccessTokenParameters,
  LoginParameters,
  VerifyAccessTokenParameters,
} from '../types';
import { FastifyReply } from 'fastify';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/oauth/authorize')
  async authorizeStart(@Res({ passthrough: true }) reply: FastifyReply) {
    return reply.sendFile('sign-in.html');
  }

  @Post('/oauth/authorize')
  async getAuthorizationCode(
    @Body() { email, password }: LoginParameters,
    @Query('client_id') client_id: string,
    @Query('state') state: string,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { redirectUrl, code } = await this.authService.getAuthorizationCode({
      email,
      password,
      client_id,
    });

    return reply
      .status(302)
      .redirect(`${redirectUrl}?code=${code}&state=${state}`);
  }

  @Post('/oauth/token')
  getAccessToken(@Body() args: GetAccessTokenParameters) {
    return this.authService.getSignedJwtToken(args);
  }

  @Post('/oauth/verify')
  verifyAccessToken(@Body() args: VerifyAccessTokenParameters) {
    return this.authService.verifyJwtToken(args);
  }
}
