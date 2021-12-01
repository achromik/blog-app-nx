import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DeviceIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const deviceIdHeader = context.switchToHttp().getRequest<Request>().headers[
      'x-device-id'
    ];

    if (!deviceIdHeader) {
      throw new BadRequestException('Missing device id in request headers');
    }

    return true;
  }
}
