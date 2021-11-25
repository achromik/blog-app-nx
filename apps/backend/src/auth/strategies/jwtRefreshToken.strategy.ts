import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../config/app/configuration.service';
import { UserService } from '../../user/user.service';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly configService: AppConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.refreshTokenSecretKey,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<RefreshTokenPayload> {
    const { userId, jti } = payload;
    const user = await this.userService.getById(userId);

    const isValid = await user.validateRefreshToken(jti);

    if (!user || !isValid) {
      throw new UnauthorizedException('Provided refreshToken is invalid!');
    }
    return payload;
  }
}
