import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { AppConfigService } from '../config/app/configuration.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService
  ) {}

  async register(createUserDTO: CreateUserDTO) {
    const user = await this.userService.create(createUserDTO);

    return user;
  }

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (user.checkPassword(password)) {
      return user;
    }

    return null;
  }

  getRefreshToken(userId: string): { refreshToken: string; jwtId: string } {
    const jwtId = uuidv4();
    const payload = { userId };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.refreshTokenSecretKey,
      expiresIn: this.configService.refreshTokenTTL,
      jwtid: jwtId,
    });

    return { refreshToken, jwtId };
  }

  getAccessToken(user: UserDocument) {
    const payload: JwtPayload = { username: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
