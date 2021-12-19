import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Header } from '@libs/types';
import { AppConfigService } from '../../config/app/configuration.service';
import { TokenService } from '../../token/token.service';
import { UsersService } from '../../users/users.service';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    configService: AppConfigService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.refreshTokenSecretKey,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: RefreshTokenPayload
  ): Promise<RefreshTokenPayload> {
    const { userId, jti } = payload;

    const device = req.headers[Header.DEVICE_ID];

    const user = await this.usersService.getById(userId);

    if (!user) {
      this.logger.error(`User with id: ${userId} not found`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    const token = await this.tokenService.findByUserId(userId);

    if (!token) {
      this.logger.error(`Token for userId: ${userId} not found`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    const isValid = await token.validateToken(userId, jti, device);

    if (!isValid) {
      this.logger.error(`Token for userId: ${userId} is invalid`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    return payload;
  }
}
