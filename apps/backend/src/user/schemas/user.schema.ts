import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UserDocument } from '../interfaces/user.interface';

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
    jti: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

UserSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      const passwordSaltRound = await bcrypt.genSalt(10);

      // due to impossible assign into read-only prop
      // below is hook to miss that issue
      (this.password as UserDocument['password']) = await bcrypt.hash(
        this.password,
        passwordSaltRound
      );
    }
    if (this.jti && this.isModified('jti')) {
      const jtiSaltRound = await bcrypt.genSalt(10);

      // due to impossible assign into read-only prop
      // below is hook to miss that issue
      (this.jti as UserDocument['jti']) = await bcrypt.hash(
        this.jti,
        jtiSaltRound
      );
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

UserSchema.methods.validateRefreshToken = async function (
  this: UserDocument,
  jti: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(jti, this.jti);
  return isValid;
};

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (_document: UserDocument, ret: UserDocument) {
    // ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // due to impossible assign into read-only prop
    // below is hook to miss that issue
    (ret.password as UserDocument['password']) = undefined;
    (ret.jti as UserDocument['jti']) = undefined;
    return ret;
  },
});
