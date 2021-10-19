import { registerAs } from '@nestjs/config';
import { AppConfig } from '../interfaces/app.interface';
import { getEnvNumber, getEnvString } from '../utils';

export default registerAs<AppConfig>(
  'app',
  (): AppConfig => ({
    port: getEnvNumber('PORT', 5000),
    globalPrefix: getEnvString('API_GLOBAL_PREFIX', 'api'),
    secretKey: getEnvString('JWT_SECRET_KEY'),
    jwtTTL: getEnvNumber('JWT_TTL', 60),
  })
);
