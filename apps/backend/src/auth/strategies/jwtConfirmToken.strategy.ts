import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../config/app/configuration.service';
import { UserFromJWT } from '../../users/interfaces/userFromJWT.interface';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-confirmation-token'
) {
  private readonly logger = new Logger(JwtConfirmTokenStrategy.name);

  constructor(
    private readonly configService: AppConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: configService.secretKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJWT> {
    const userEmail = payload.sub;

    const user = await this.usersService.getByEmail(userEmail);

    if (!user) {
      this.logger.error(`User with email: ${userEmail} not found`);

      throw new BadRequestException('Invalid confirmation token!');
    }

    return { email: payload.sub, userId: user._id };
  }
}
