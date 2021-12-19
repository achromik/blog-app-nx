import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class ConfirmTokenAuthGuard extends AuthGuard('jwt-confirmation-token') {
  handleRequest(err, token, info: Error) {
    if (info instanceof TokenExpiredError) {
      throw new BadRequestException('Token expired!');
    }

    if (info instanceof JsonWebTokenError) {
      throw new BadRequestException(info.message);
    }

    if (err || !token) {
      throw new BadRequestException(
        err?.message ?? 'Confirmation token went wrong!'
      );
    }

    return token;
  }
}
