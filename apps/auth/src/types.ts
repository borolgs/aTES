/**
 * Users
 */

export const userRoles = ['admin', 'manager', 'accountant', 'user'] as const;
export type UserRoleType = typeof userRoles[number];

export interface IUser {
  publicId: string;
  email: string;
  name: string;
  role?: UserRoleType;
}

export type FindUsersResponse = {
  results: IUser[];
};

export type RegisterParameters = {
  name: string;
  email: string;
  password: string;
  role?: UserRoleType;
};
export type RegisterResponse = IUser;

/**
 * Applications
 */
export interface IClientApplication {
  name: string;
  baseUrl: string;
  callbackUrl: string;

  clientId: string;
  clientSecret: string;
}

export type RegisterApplicationParameters = {
  name: string;
  baseUrl: string;
  callbackUrl: string;
};

export type EditApplicationParameters = {
  clientId: string;
  name?: string;
  baseUrl?: string;
  callbackUrl?: string;
};

/**
 * OAuth
 */

// Authorization Code
export type LoginParameters = {
  email: string;
  password: string;
};
export type GetAuthorizationCodeParameters = LoginParameters & {
  client_id: string;
};
export type GetAuthorizationCodeResponse = {
  code: string;
  redirectUrl: string;
};

// Access Token
export type GetAccessTokenParameters = {
  code: string;
  client_id: string;
  client_secret: string;
};
export type GetAccessTokenResponse = {
  access_token: string;
};

export type VerifyAccessTokenParameters = {
  access_token: string;
};

export type VerifyAccessTokenResponse = {
  access_token: string;
  user: IUser;
};
