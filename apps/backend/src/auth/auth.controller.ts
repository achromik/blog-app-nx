import { Controller, Post, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthenticationPayload, AuthResponse } from '@libs/types';

import { UserDocument } from '../user/interfaces/user.interface';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { UserService } from '../user/user.service';
import { RefreshTokenAuthGuard } from './guards/refreshToken-auth.guard';
import { RequestWithUserID } from './interfaces/requestWithUserId.interface';
import { DeviceIdGuard } from '../shared/guards/device.guard';

@UseGuards(DeviceIdGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Headers('x-device-id') device: string
  ): Promise<AuthResponse> {
    const { user } = req;
    const accessToken = this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(
      user._id,
      device
    );

    const payload = this.buildResponsePayload(user, accessToken, refreshToken);

    return {
      status: 'success',
      data: payload,
    };
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUserID,
    @Headers('x-device-id') device: string
  ): Promise<AuthResponse> {
    const { userId, jti } = req.user;

    const user = await this.userService.getById(userId);

    const accessToken = this.authService.createAccessToken(user);

    await this.authService.revokeRefreshToken(jti);

    const refreshToken = await this.authService.createRefreshToken(
      userId,
      device
    );

    const payload = this.buildResponsePayload(user, accessToken, refreshToken);

    return {
      status: 'success',
      data: payload,
    };
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
