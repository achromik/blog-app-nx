import { registerAs } from '@nestjs/config';
import { AppConfig } from '../interfaces/app.interface';
import { getEnvNumber, getEnvString } from '../utils';

export default registerAs<AppConfig>(
  'app',
  (): AppConfig => ({
    port: getEnvNumber('PORT', 5000),
    globalPrefix: getEnvString('API_GLOBAL_PREFIX', 'api'),
  })
);
