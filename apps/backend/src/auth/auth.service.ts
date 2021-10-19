import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { sanitize } from '../shared/utils/sanitize';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { User } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  sanitize(user: User): User {
    return sanitize<User>(user, ['password', '_id']);
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserDTO);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email, false);

    if (user && bcrypt.compareSync(password, user.password)) {
      (user.password as User['password']) = undefined;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayload = { username: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
