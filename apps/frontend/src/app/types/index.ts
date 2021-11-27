import { Tokens } from '@libs/types';

type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

export interface AuthState {
  status: Status;
  isAuthenticated: boolean;
  error: string;
  accessToken: Tokens['accessToken'];
  refreshToken: Tokens['refreshToken'];
}
