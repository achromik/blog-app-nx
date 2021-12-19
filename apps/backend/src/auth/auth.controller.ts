import {
  Controller,
  Post,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthResponse, Header } from '@libs/types';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';
import { RefreshTokenAuthGuard } from './guards/refreshToken-auth.guard';
import { RequestWithUserId } from './interfaces/requestWithUserId.interface';
import { DeviceIdGuard } from '../shared/guards/device.guard';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard, DeviceIdGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Body(new ValidationPipe()) loginUserDto: LoginUserDTO,
    @Headers(Header.DEVICE_ID) deviceId: string
  ): Promise<AuthResponse> {
    const { user } = req;

    return await this.authService.login(user, deviceId);
  }

  @UseGuards(JwtAuthGuard, RefreshTokenAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req: RequestWithUserId) {
    const { userId } = req.user;

    return await this.authService.logout(userId);
  }

  @UseGuards(DeviceIdGuard, RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUserId,
    @Headers(Header.DEVICE_ID) deviceId: string
  ): Promise<AuthResponse> {
    const { userId } = req.user;

    return this.authService.refresh(userId, deviceId);
  }
}
