import {
  Controller,
  Post,
  UseGuards,
  Request,
  Headers,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import {
  AuthenticationPayload,
  AuthResponse,
  Header,
  Status,
} from '@libs/types';

import { UserDocument } from '../user/interfaces/user.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { UserService } from '../user/user.service';
import { RefreshTokenAuthGuard } from './guards/refreshToken-auth.guard';
import { RequestWithUserID } from './interfaces/requestWithUserId.interface';
import { DeviceIdGuard } from '../shared/guards/device.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    @Headers(Header.DEVICE_ID) deviceId: string
  ): Promise<AuthResponse> {
    const { user } = req;
    const accessToken = this.authService.createAccessToken(user);
    const refreshToken = await this.authService.createRefreshToken(
      user._id,
      deviceId
    );

    const payload = this.buildResponsePayload(user, accessToken, refreshToken);

    return {
      status: Status.SUCCESS,
      data: payload,
    };
  }

  @UseGuards(JwtAuthGuard, RefreshTokenAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req: RequestWithUserID) {
    try {
      const { userId } = req.user;

      await this.authService.revokeUserRefreshToken(userId);

      return {
        status: Status.SUCCESS,
        data: this.buildResponsePayload(null, '', ''),
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUserID,
    @Headers(Header.DEVICE_ID) deviceId: string
  ): Promise<AuthResponse> {
    const { userId } = req.user;

    const user = await this.userService.getById(userId);

    const accessToken = this.authService.createAccessToken(user);

    await this.authService.revokeUserRefreshToken(userId);

    const refreshToken = await this.authService.createRefreshToken(
      userId,
      deviceId
    );

    const payload = this.buildResponsePayload(user, accessToken, refreshToken);

    return {
      status: Status.SUCCESS,
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
