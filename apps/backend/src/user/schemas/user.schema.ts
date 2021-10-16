import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../interfaces/user.interface';

export const UserSchema = new mongoose.Schema<User>({
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
});

UserSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      (user.password as User['password']) = hash;
      next();
    });
  });
});

UserSchema.methods.checkPassword = function (
  attempt: string,
  callback: <T extends unknown[], R = unknown>(...args: T) => R
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  bcrypt.compare(attempt, user.password, (err, isMatch: boolean) => {
    if (err) {
      return callback(err);
    }
    return callback(null, isMatch);
  });
};
