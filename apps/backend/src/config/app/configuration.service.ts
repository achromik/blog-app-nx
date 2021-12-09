import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('app.port');
  }

  get globalPrefix(): string {
    return this.configService.get<string>('app.globalPrefix');
  }

  get secretKey(): string {
    return this.configService.get<string>('app.secretKey');
  }

  get jwtTTL(): number {
    return this.configService.get<number>('app.jwtTTL');
  }

  get refreshTokenSecretKey(): string {
    return this.configService.get<string>('app.refreshTokenSecretKey');
  }

  get refreshTokenTTL(): number {
    return this.configService.get<number>('app.refreshTokenTTL');
  }

  get confirmTokenSecretKey(): string {
    return this.configService.get<string>('app.confirmTokenSecretKet');
  }

  get ConfirmTokenTTL(): number {
    return this.configService.get<number>('app.confirmTokenTTL');
  }

  get appName(): string {
    return this.configService.get<string>('app.name');
  }
}
