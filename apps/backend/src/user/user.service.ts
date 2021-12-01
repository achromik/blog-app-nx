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
}
