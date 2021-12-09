import { getEnvBoolean } from './getEnv';

describe('getEnv', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });
  describe('getEnvBoolean', () => {
    it('should return boolean process.env value', () => {
      process.env.FOO = 'true';
      process.env.BAR = 'false';

      expect(getEnvBoolean('FOO')).toBe(true);
      expect(getEnvBoolean('BAR')).toBe(false);
    });

    it('should return fallback value if env is not set', () => {
      process.env.FOO = undefined;
      process.env.BAR = undefined;

      expect(getEnvBoolean('FOO', true)).toBe(true);
      expect(getEnvBoolean('BAR', false)).toBe(false);
    });
  });
});
