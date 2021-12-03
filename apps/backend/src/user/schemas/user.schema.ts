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
      const salt = await bcrypt.genSalt(10);

      // due to impossible assign into read-only prop
      // below is hook to miss that issue
      (this.password as UserDocument['password']) = await bcrypt.hash(
        this.password,
        salt
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

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (_document: UserDocument, ret: UserDocument) {
    delete ret._id;
    delete ret.__v;

    // due to impossible assign into read-only prop
    // below is hook to miss that issue
    (ret.password as UserDocument['password']) = undefined;

    return ret;
  },
});
