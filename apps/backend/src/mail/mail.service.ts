import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '../user/interfaces/user.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly nestMailerService: NestMailerService) {}

  async registrationEmail(user: UserDocument) {
    try {
      await this.nestMailerService.sendMail({
        to: user.email,
        subject: 'Registration ✔',
        template: './registration',
        context: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      });

      this.logger.log(`Registration email sent to ${user.email}`);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
