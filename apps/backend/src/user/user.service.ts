import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { sanitize } from '../shared/utils/sanitize';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  private sanitize(user: User): User {
    return sanitize<User>(user, ['password']);
  }

  async create(createUserDto: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    await createdUser.save();

    return this.sanitize(createdUser);
  }

  async findOneByEmail(email: string, shouldSanitize = true): Promise<User> {
    const user = await this.userModel.findOne({ email });

    return shouldSanitize ? this.sanitize(user) : user;
  }
}
