import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDTO } from '../auth/dto/create-user.dto';
import { UserDocument } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  async create(
    createUser: CreateUserDTO & { confirmToken: string }
  ): Promise<UserDocument> {
    const createdUser = new this.userModel(createUser);

    try {
      await createdUser.save();

      return createdUser;
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new ConflictException('User with that email already exists!');
      }
      throw err;
    }
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    return user;
  }

  async setStatus(
    email: string,
    isActive = true,
    confirmToken?: string
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    // Due to impossibility to reassign the read-only property,
    // below is the hook to miss that issue
    (user.isActive as UserDocument['isActive']) = isActive;
    (user.confirmToken as UserDocument['confirmToken']) = confirmToken;

    user.markModified('confirmToken');
    await user.save();

    return user;
  }
}
