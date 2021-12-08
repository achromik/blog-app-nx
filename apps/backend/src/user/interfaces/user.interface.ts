import { Document } from 'mongoose';
import { User } from '@libs/types';

export interface UserDocument extends Document, Readonly<User> {
  readonly password: string;
  readonly isActive: boolean;
  readonly confirmToken: string;
  checkPassword: (password: string) => Promise<boolean>;
}
