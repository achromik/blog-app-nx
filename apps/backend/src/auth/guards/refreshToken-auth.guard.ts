import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new BadRequestException('Token expired!');
    }

    if (info instanceof JsonWebTokenError) {
      throw new BadRequestException(info.message);
    }

    if (err || !user) {
      throw new BadRequestException(
        err?.message ?? 'Refreshing token went wrong!'
      );
    }
    return user;
  }
}
