export interface AppConfig {
  port: number;
  globalPrefix: string;
  secretKey: string;
  jwtTTL: number;
  refreshTokenSecretKey: string;
  refreshTokenTTL: number;
}
