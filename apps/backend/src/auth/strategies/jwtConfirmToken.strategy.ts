import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../config/app/configuration.service';
import { UserFromJWT } from '../../user/interfaces/userFromJWT.interface';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-confirmation-token'
) {
  private readonly logger = new Logger(JwtConfirmTokenStrategy.name);

  constructor(
    private readonly configService: AppConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: configService.secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJWT> {
    const userEmail = payload.sub;

    const user = await this.userService.getByEmail(userEmail);

    if (!user) {
      this.logger.error(`User with email: ${userEmail} not found`);

      throw new BadRequestException('Invalid confirmation token!');
    }

    return { email: payload.sub, userId: user._id };
  }
}
