import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users';
import {
  GetAuthorizationCodeParameters,
  GetAuthorizationCodeResponse,
  GetAccessTokenParameters,
  LoginParameters,
  RegisterParameters,
  RegisterResponse,
  VerifyAccessTokenParameters,
  GetAccessTokenResponse,
  VerifyAccessTokenResponse,
} from '../types';
import { ClientAppsService } from '../client-apps';
import { User } from '../users/users.entity';
import { ClientApplication } from '../client-apps/client-app.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private authCodeService = new AuthCodeService();
  constructor(
    private readonly usersService: UsersService,
    private readonly appsService: ClientAppsService,
  ) {}

  async register(args: RegisterParameters): Promise<RegisterResponse> {
    const user = await this.usersService.create(args);
    return user as any;
  }

  async getAuthorizationCode(
    args: GetAuthorizationCodeParameters,
  ): Promise<GetAuthorizationCodeResponse> {
    const user = await this.login({
      email: args.email,
      password: args.password,
    });
    const clientApp = await this.appsService.findOne({
      clientId: args.client_id,
    });

    const code = await this.generateAuthorizationCode(user, clientApp);

    return { code, redirectUrl: clientApp.callbackUrl };
  }

  private async login({ email, password }: LoginParameters) {
    const user = await this.usersService.findOneByEmail({ email });

    const match = await user.matchPassword(password);
    if (!match) {
      throw new ForbiddenException();
    }
    return user;
  }

  async generateAuthorizationCode(user: User, app: ClientApplication) {
    const code = this.authCodeService.create({
      userId: user.id,
      clientId: app.clientId,
    });
    return code;
  }

  async getSignedJwtToken(
    args: GetAccessTokenParameters,
  ): Promise<GetAccessTokenResponse> {
    const app = await this.appsService.findOne({ clientId: args.client_id });
    if (app.clientSecret !== args.client_secret) {
      throw new UnauthorizedException();
    }

    const authCode = this.authCodeService.get(args.code);
    if (!authCode) {
      throw new UnauthorizedException();
    }

    if (authCode.clientId !== args.client_id) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(authCode.userId);

    return {
      access_token: jwt.sign({ id: user.id }, 'JWT_SECRET', {
        expiresIn: '1d',
      }),
    };
  }

  async verifyJwtToken({
    access_token,
  }: VerifyAccessTokenParameters): Promise<VerifyAccessTokenResponse> {
    const { id } = jwt.verify(access_token, 'JWT_SECRET') as { id: number };
    const user = await this.usersService.findOneById(id);

    return { access_token, user };
  }
}

type AuthCode = {
  clientId: string;
  userId: number;
  scope?: any;
  expirationDate: Date;
};

class AuthCodeService {
  private codes: Record<string, AuthCode> = {};
  private liveTime = 180000;
  constructor() {
    setInterval(() => {
      for (const [key, code] of Object.entries(this.codes)) {
        const now = new Date();
        if (now > code.expirationDate) {
          delete this.codes[key];
        }
      }
    }, this.liveTime);
  }

  public create({ clientId, userId }: Omit<AuthCode, 'expirationDate'>) {
    const expirationDate = new Date(new Date().getTime() + this.liveTime);
    const key = crypto.randomUUID();
    this.codes[key] = {
      clientId,
      userId,
      expirationDate,
    };
    return key;
  }

  public get(code: string): AuthCode | null {
    const authCode = this.codes[code] ?? null;
    const now = new Date();
    if (authCode && now > authCode.expirationDate) {
      delete this.codes[code];
      return null;
    }
    return authCode;
  }
}
