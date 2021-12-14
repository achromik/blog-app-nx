import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { MailService } from './mail.service';
import { MailerConfigService } from '../config/mailer/configuration.service';
import { MailerConfigModule } from '../config/mailer/configuration.module';

@Module({
  imports: [
    MailerConfigModule,
    NestMailerModule.forRootAsync({
      imports: [MailerConfigModule],
      useFactory: async (config: MailerConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            type: 'OAuth2',
            user: config.user,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            refreshToken: config.refreshToken,
          },
        },
        defaults: {
          from: config.mailFrom,
        },
        template: {
          dir: join(__dirname, 'assets/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [MailerConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
