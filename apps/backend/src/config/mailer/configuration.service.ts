import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
  constructor(private configService: ConfigService) {}

  get user(): string {
    return this.configService.get<string>('mailer.user');
  }

  get clientId(): string {
    return this.configService.get<string>('mailer.clientId');
  }

  get clientSecret(): string {
    return this.configService.get<string>('mailer.clientSecret');
  }

  get refreshToken(): string {
    return this.configService.get<string>('mailer.refreshToken');
  }
}
