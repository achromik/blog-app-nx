import { Document } from 'mongoose';
import { User } from '@libs/types';

export interface UserDocument extends Document, Readonly<User> {
  readonly password: string;
  readonly jti: string;
  checkPassword: (password: string) => Promise<boolean>;
  validateRefreshToken: (token: string) => Promise<boolean>;
}
