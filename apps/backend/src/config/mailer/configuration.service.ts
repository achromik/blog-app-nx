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

  get mailFrom(): string {
    return this.configService.get<string>('mailer.mailFrom');
  }

  get appName(): string {
    return this.configService.get<string>('app.appName');
  }

  get appHost(): string {
    return this.configService.get<string>('app.appHost');
  }

  get appPort(): number {
    return this.configService.get<number>('app.appPort');
  }

  get appURL(): string {
    const port = this.appPort;
    const host = this.appHost;

    return `${host}${port ? `:${port}` : ''}`;
  }
}
