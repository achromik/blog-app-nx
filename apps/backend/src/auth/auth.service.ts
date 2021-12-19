import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from './interfaces/jwtPayload.interface';
import { UserDocument } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { AppConfigService } from '../config/app/configuration.service';
import { TokenDocument } from '../token/interfaces/token.interface';
import { TokenService } from '../token/token.service';
import {
  AuthenticationPayload,
  AuthResponse,
  ApiResponseStatus,
} from '@libs/types';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: AppConfigService
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async getAuthenticatedUser(
    email: string,
    password: string
  ): Promise<UserDocument> {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Provided credentials are invalid!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Pending account. Please verify your email.'
      );
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Provided credentials are invalid!');
    }

    return user;
  }

  async login(user: UserDocument, deviceId: string): Promise<AuthResponse> {
    const accessToken = this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user._id, deviceId);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: this.buildResponsePayload(user, accessToken, refreshToken),
    };
  }

  async logout(userId: string): Promise<AuthResponse> {
    await this.revokeUserRefreshToken(userId);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: this.buildResponsePayload(null, '', ''),
    };
  }

  async refresh(userId: string, deviceId: string): Promise<AuthResponse> {
    const user = await this.usersService.getById(userId);

    const accessToken = this.createAccessToken(user);

    await this.revokeUserRefreshToken(userId);

    const refreshToken = await this.createRefreshToken(userId, deviceId);

    return {
      status: ApiResponseStatus.SUCCESS,
      data: this.buildResponsePayload(user, accessToken, refreshToken),
    };
  }

  private async createRefreshToken(
    userId: string,
    deviceId: string
  ): Promise<string> {
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

  private createAccessToken(user: UserDocument): string {
    const payload: JwtPayload = { username: user.email, sub: user._id };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  private async revokeUserRefreshToken(userId: string): Promise<TokenDocument> {
    return await this.tokenService.removeByUserId(userId);
  }

  private buildResponsePayload(
    user: UserDocument,
    accessToken: string,
    refreshToken?: string
  ): AuthenticationPayload {
    return {
      user: user,
      payload: {
        accessToken,
        refreshToken,
      },
    };
  }
}
