type EnvVariable = string | number | boolean | Record<string, unknown>;

const getEnv =
  <T extends EnvVariable>(defaultValue: T) =>
  (key: string, fallbackValue: T = defaultValue): T => {
    const value: string | undefined = process.env[key];

    if (!value) {
      return fallbackValue;
    }

    switch (typeof defaultValue) {
      case 'string':
        return value as T;
      case 'number':
        return !isNaN(parseFloat(value)) && !isNaN(Number(value))
          ? (Number(value) as T)
          : fallbackValue;
      case 'boolean':
        return value === '' ? fallbackValue : ((value === 'true') as T);
      case 'object':
        try {
          return JSON.parse(value);
        } catch (error) {
          return fallbackValue;
        }
    }
  };

export const getEnvString = getEnv<string>('');
export const getEnvNumber = getEnv<number>(0);
export const getEnvBoolean = getEnv<boolean>(false);
export const getEnvObject = getEnv<Record<string, unknown>>({});
