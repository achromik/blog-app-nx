import { registerAs } from '@nestjs/config';
import { MailerConfig } from '../interfaces/mailer.interface';
import { getEnvString } from '../utils';

export default registerAs<MailerConfig>('mailer', (): MailerConfig => {
  const user = getEnvString('GOOGLE_USER');
  const clientId = getEnvString('GOOGLE_CLIENT_ID');
  const clientSecret = getEnvString('GOOGLE_CLIENT_SECRET');
  const refreshToken = getEnvString('GOOGLE_REFRESH_TOKEN');

  return {
    user,
    clientId,
    clientSecret,
    refreshToken,
  };
});
