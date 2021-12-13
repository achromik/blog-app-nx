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

export enum StoreNamespace {
  AUTH = 'auth',
}

export const ActionTypePrefix = {
  AUTH_LOGIN: `${StoreNamespace.AUTH}/login`,
  AUTH_REFRESH_TOKEN: `${StoreNamespace.AUTH}/refreshToken`,
  AUTH_REGISTER: `${StoreNamespace.AUTH}/register`,
  AUTH_CONFIRM: `${StoreNamespace.AUTH}/confirm`,
} as const;
