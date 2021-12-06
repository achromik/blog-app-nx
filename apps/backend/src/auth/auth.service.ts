import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserDocument } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';
import { AppConfigService } from '../config/app/configuration.service';
import { TokenDocument } from '../token/interfaces/token.interface';
import { TokenService } from '../token/token.service';
import {
  AuthenticationPayload,
  AuthResponse,
  RegisterUserResponse,
  Status,
} from '@libs/types';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: AppConfigService
  ) {}

  async getAuthenticatedUser(
    email: string,
    password: string
  ): Promise<UserDocument> {
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

  async login(user: UserDocument, deviceId: string): Promise<AuthResponse> {
    const accessToken = this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user._id, deviceId);

    return {
      status: Status.SUCCESS,
      data: this.buildResponsePayload(user, accessToken, refreshToken),
    };
  }

  async logout(userId: string): Promise<AuthResponse> {
    await this.revokeUserRefreshToken(userId);

    return {
      status: Status.SUCCESS,
      data: this.buildResponsePayload(null, '', ''),
    };
  }

  async refresh(userId: string, deviceId: string): Promise<AuthResponse> {
    const user = await this.userService.getById(userId);

    const accessToken = this.createAccessToken(user);

    await this.revokeUserRefreshToken(userId);

    const refreshToken = await this.createRefreshToken(userId, deviceId);

    return {
      status: Status.SUCCESS,
      data: this.buildResponsePayload(user, accessToken, refreshToken),
    };
  }

  async register(createUserDto: CreateUserDTO): Promise<RegisterUserResponse> {
    const newUser = await this.userService.create(createUserDto);

    // await this.mailerService.sendMail({
    //   to: 'achromik@maildrop.c', // list of receivers
    //   from: 'test@achromik.com', // sender address
    //   subject: 'Testing Nest MailerModule ✔', // Subject line
    //   text: 'welcome', // plaintext body
    //   html: '<b>welcome</b>', // HTML body content
    // });
    // .then((data) => {
    //   console.log(data);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    return {
      status: Status.SUCCESS,
      data: { user: newUser },
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
