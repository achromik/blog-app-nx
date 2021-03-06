import { registerAs } from '@nestjs/config';
import { MongoConfig } from '../../interfaces/mongoConfig.interface';
import { getEnvNumber, getEnvString } from '@libs/utils';

export default registerAs<MongoConfig>('mongo', (): MongoConfig => {
  const host = getEnvString('MONGODB_HOST', 'localhost');
  const port = getEnvNumber('MONGODB_PORT', 21017);
  const user = getEnvString('MONGODB_USERNAME');
  const pass = getEnvString('MONGODB_PASSWORD');
  const dbName = getEnvString('MONGODB_DATABASE_NAME', 'nxAppDb');
  const dbSrvURL = getEnvString('MONGODB_SRV_URL');

  return {
    host,
    port,
    user,
    pass,
    dbName,
    dbSrvURL,
  };
});
