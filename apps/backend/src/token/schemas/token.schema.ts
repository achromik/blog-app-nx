import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

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

TokenSchema.pre(/^save/, async function (this: TokenDocument, next) {
  try {
    if (this.jti && this.isModified('jti')) {
      const salt = await bcrypt.genSalt(10);

      // Due to impossibility to reassign the read-only property,
      // below is the hook to miss that issue
      (this.jti as TokenDocument['jti']) = await bcrypt.hash(this.jti, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

TokenSchema.methods.validateToken = async function (
  this: TokenDocument,
  userId: string,
  jti: string,
  device: string
): Promise<boolean> {
  const isJtiHashValid = await bcrypt.compare(jti, this.jti);
  const isValid =
    this.userId.toString() === userId &&
    isJtiHashValid &&
    this.device === device;

  return isValid;
};
