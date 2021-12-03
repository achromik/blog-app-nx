import { Document } from 'mongoose';
import { User } from '@libs/types';

export interface UserDocument extends Document, Readonly<User> {
  readonly password: string;
  checkPassword: (password: string) => Promise<boolean>;
}
