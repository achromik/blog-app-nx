import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UserDocument } from '../interfaces/user.interface';
import { hashSHA256 } from '@libs/utils';

export const UserSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    firstName: String,
    lastName: String,
    isActive: {
      type: Boolean,
      default: false,
    },
    confirmToken: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

UserSchema.pre(/^save/, async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);

      // Due to impossibility to reassign the read-only property,
      // below is the hook to miss that issue
      (this.password as UserDocument['password']) = await bcrypt.hash(
        this.password,
        salt
      );
    }

    if (this.confirmToken && this.isModified('confirmToken')) {
      const hash = hashSHA256(this.confirmToken);

      // Due to impossibility to reassign the read-only property,
      // below is the hook to miss that issue
      (this.confirmToken as UserDocument['confirmToken']) = hash;
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

UserSchema.methods.checkConfirmToken = function (
  this: UserDocument,
  confirmToken: string
) {
  const isValid = hashSHA256(confirmToken) === this.confirmToken;

  return isValid;
};

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (_document: UserDocument, ret: UserDocument) {
    delete ret._id;
    delete ret.__v;

    // Due to impossibility to reassign the read-only property,
    // below is the hook to miss that issue
    (ret.password as UserDocument['password']) = undefined;
    (ret.isActive as UserDocument['isActive']) = undefined;
    (ret.confirmToken as UserDocument['confirmToken']) = undefined;

    return ret;
  },
});
