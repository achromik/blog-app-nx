import * as mongoose from 'mongoose';

import { TokenDocument } from '../interfaces/token.interface';

export const TokenSchema = new mongoose.Schema<TokenDocument>(
  {
    jti: {
      type: String,
      unique: true,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    device: String,
    iat: Number,
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

TokenSchema.methods.validateToken = function (
  this: TokenDocument,
  userId: string,
  jti: string,
  device: string
): boolean {
  const isValid =
    this.userId.toString() === userId &&
    this.jti === jti &&
    this.device === device;

  return isValid;
};
