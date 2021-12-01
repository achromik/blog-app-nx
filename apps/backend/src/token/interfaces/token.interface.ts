import { Document } from 'mongoose';
import { Token } from '@libs/types';

export interface TokenDocument extends Document, Readonly<Token> {
  validateToken: (userId: string, jti: string, device: string) => boolean;
}
