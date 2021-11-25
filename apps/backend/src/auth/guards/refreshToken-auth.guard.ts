import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new ForbiddenException('Token expired!');
    }

    if (info instanceof JsonWebTokenError) {
      throw new ForbiddenException(info.message);
    }

    if (err || !user) {
      throw new ForbiddenException(err?.message ?? 'Refresh token went wrong!');
    }
    return user;
  }
}
