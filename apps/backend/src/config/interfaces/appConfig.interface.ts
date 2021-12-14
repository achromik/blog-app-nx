export interface AppConfig {
  port: number;
  globalPrefix: string;
  secretKey: string;
  jwtTTL: number;
  refreshTokenSecretKey: string;
  refreshTokenTTL: number;
  confirmTokenSecretKey: string;
  confirmTokenTTL: number;
  appName: string;
  appPort: number;
  appHost: string;
}
