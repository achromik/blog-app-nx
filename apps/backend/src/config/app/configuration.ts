import { registerAs } from '@nestjs/config';
import { AppConfig } from '../interfaces/appConfig.interface';
import { getEnvNumber, getEnvString } from '@libs/utils';

export default registerAs<AppConfig>(
  'app',
  (): AppConfig => ({
    port: getEnvNumber('PORT', 5000),
    globalPrefix: getEnvString('API_GLOBAL_PREFIX', 'api'),
    secretKey: getEnvString('JWT_SECRET_KEY'),
    jwtTTL: getEnvNumber('JWT_TTL', 60),
    refreshTokenSecretKey: getEnvString('JWT_REFRESH_TOKEN_SECRET_KEY'),
    refreshTokenTTL: getEnvNumber('JWT_REFRESH_TOKEN_TTL', 120),
    confirmTokenSecretKey: getEnvString('JWT_REFRESH_TOKEN_SECRET_KEY'),
    confirmTokenTTL: getEnvNumber('JWT_REFRESH_TOKEN_TTL', 24 * 60 * 60),
    name: getEnvString('APP_NAME', process.env.npm_package_name),
  })
);
