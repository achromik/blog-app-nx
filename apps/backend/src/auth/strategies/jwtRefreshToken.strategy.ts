import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../config/app/configuration.service';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../user/user.service';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    configService: AppConfigService,
    private readonly userService: UserService,
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

    const device = req.headers['x-device-id'];

    const user = await this.userService.getById(userId);

    if (!user) {
      this.logger.error(`User with id: ${userId} not found`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    const token = await this.tokenService.findByJTI(jti);

    if (!token) {
      this.logger.error(`Token with jti: ${jti} not found`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    const isValid = token.validateToken(userId, jti, device);

    if (!isValid) {
      this.logger.error(`Token: ${token} is invalid`);

      throw new BadRequestException('Provided refreshToken is invalid!');
    }

    return payload;
  }
}
