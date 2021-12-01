import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import {
  AuthenticationPayload,
  AuthResponse,
  RegisterUserResponse,
} from '@libs/types';

import { UserDocument } from '../user/interfaces/user.interface';

import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { UserService } from '../user/user.service';
import { RefreshTokenAuthGuard } from './guards/refreshToken-auth.guard';
import { RequestWithUserID } from './interfaces/requestWithUserId.interface';
import { DeviceIdGuard } from '../shared/guards/device.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async createUser(
    @Body() createUserDTO: RegisterUserDTO
  ): Promise<RegisterUserResponse> {
    try {
      const newUser = await this.authService.register(createUserDTO);

      return {
        status: 'success',
        data: { user: newUser },
      };
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new BadRequestException('User with that email already exists!');
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @UseGuards(LocalAuthGuard, DeviceIdGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Headers('x-device-id') device: string
  ): Promise<AuthResponse> {
    const { user } = req;
    const accessToken = this.authService.getAccessToken(user);
    const refreshToken = await this.authService.getRefreshToken(
      user._id,
      device
    );

    const payload = this.buildResponsePayload(user, accessToken, refreshToken);

    return {
      status: 'success',
      data: payload,
    };
  }

  @UseGuards(RefreshTokenAuthGuard, DeviceIdGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUserID,
    @Headers('x-device-id') device: string
  ): Promise<AuthResponse> {
    const { userId, jti } = req.user;

    const user = await this.userService.getById(userId);

    const accessToken = this.authService.getAccessToken(user);

    await this.authService.revokeRefreshToken(jti);

    const refreshToken = await this.authService.getRefreshToken(userId, device);

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
