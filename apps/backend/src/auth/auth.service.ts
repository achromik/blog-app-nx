import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserDocument } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { AppConfigService } from '../config/app/configuration.service';
import { Token } from '@libs/types';
import { TokenDocument } from '../token/interfaces/token.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: AppConfigService
  ) {}

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    const jti = uuidv4();
    const payload = { userId };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.refreshTokenSecretKey,
      expiresIn: this.configService.refreshTokenTTL,
      jwtid: jti,
    });

    const { iat } = this.jwtService.decode(refreshToken) as { iat: number };

    await this.tokenService.create({
      userId,
      device: deviceId,
      jti,
      iat,
    });

    return refreshToken;
  }

  async setRefreshToken(token: Token): Promise<TokenDocument> {
    console.log({ ...token });
    const createdToken = await this.tokenService.create(token);

    return createdToken;
  }

  createAccessToken(user: UserDocument) {
    const payload: JwtPayload = { username: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async revokeRefreshToken(jti: string) {
    await this.tokenService.removeByJTI(jti);
  }
}
