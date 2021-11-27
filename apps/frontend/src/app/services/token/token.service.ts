export class TokenService {
  static getAccessToken(): string {
    return sessionStorage.getItem('token') as string;
  }

  static setAccessToken(accessToken: string) {
    sessionStorage.setItem('token', accessToken);
  }

  static removeAccessToken() {
    sessionStorage.removeItem('token');
  }

  static getRefreshToken(): string {
    return sessionStorage.getItem('refreshToken') as string;
  }

  static setRefreshToken(refreshToken: string) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }

  static removeRefreshToken() {
    sessionStorage.removeItem('refreshToken');
  }
}
