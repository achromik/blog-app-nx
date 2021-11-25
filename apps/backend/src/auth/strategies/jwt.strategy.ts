import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../config/app/configuration.service';
import { UserFromJWT } from '../../user/interfaces/userFromJWT.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJWT> {
    return { userId: payload.sub, email: payload.username };
  }
}
