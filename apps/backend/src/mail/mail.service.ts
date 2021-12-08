import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '../user/interfaces/user.interface';
import { MailerConfigService } from '../config/mailer/configuration.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly nestMailerService: NestMailerService,
    private readonly configService: MailerConfigService
  ) {}

  async registrationMail(user: UserDocument, confirmToken: string) {
    try {
      await this.nestMailerService.sendMail({
        to: user.email,
        subject: `${this.configService.appName} - Thank you for your registration ✔`,
        template: './confirmation',
        context: {
          name: `${user.firstName} ${user.lastName}`,
          confirmToken,
        },
      });

      this.logger.log(`Registration email sent to ${user.email}`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
