export const userRoles = ['admin', 'manager', 'accountant', 'user'] as const;
export type UserRoleType = typeof userRoles[number];

export interface IUser {
  publicId: string;
  email: string;
  name: string;
  role: UserRoleType;
}

export type OAuth2ModuleOptions = {
  client_id: string;
  client_secret: string;
  host: string;
};

export type VerifyAccessTokenResponse = {
  access_token: string;
  user: IUser;
};
