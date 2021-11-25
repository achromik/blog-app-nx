import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDTO } from './dto/create-user.dto';
import { UserDocument } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);

    await createdUser.save();

    return createdUser;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    return user;
  }

  // async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
  //   const user = await this.getById(userId);

  //   user.validateRefreshToken();
  // }

  async setRefreshToken(userId: string, jti: string) {
    // dont't change to updateOne because this solution
    // is needed to fire UserSchema.pre('save') hook
    // to store hashed refreshToken in database
    const user = await this.userModel.findById(userId);

    // due to impossible assign into read-only prop
    // below are equivalent hooks to miss that issue
    // user = Object.assign(user, { refreshToken: token });
    (user.jti as UserDocument['jti']) = jti;
    await user.save();

    return user;
  }
}
