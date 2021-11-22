import { registerAs } from '@nestjs/config';
import { MongoConfig } from '../../interfaces/mongo.interface';
import { getEnvNumber, getEnvString } from '../../utils';

export default registerAs<MongoConfig>('mongo', (): MongoConfig => {
  const host = getEnvString('MONGODB_HOST', 'localhost');
  const port = getEnvNumber('MONGODB_PORT', 21017);
  const user = getEnvString('MONGODB_USERNAME');
  const pass = getEnvString('MONGODB_PASSWORD');

  return {
    host,
    port,
    user,
    pass,
    uri: `mongodb://${user}:${pass}@${host}:${port}/`,
  };
});