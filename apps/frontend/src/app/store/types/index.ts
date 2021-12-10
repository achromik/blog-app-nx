import { Tokens } from '@libs/types';

export enum AsyncActionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

type Status = `${AsyncActionStatus}`;

export interface AuthState extends Tokens {
  status: Status;
  isAuthenticated: boolean;
  isRegistered: boolean;
  error?: string;
}

export enum actionTypePrefix {
  AUTH_LOGIN = 'auth/login',
  AUTH_REFRESH_TOKEN = 'auth/refreshToken',
  AUTH_REGISTER = '/auth/register',
}
