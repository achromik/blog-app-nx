export function types(): string {
  return 'types';
}
interface Response {
  status: ApiResponseStatus;
}
export interface AuthResponse extends Response {
  data: AuthenticationPayload;
}

export interface RegistrationResponse extends Response {
  data: UserPayload;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}
export interface RegistrationRequestPayload
  extends LoginRequestPayload,
    UserPayload {
  confirmPassword: string;
}

export interface RefreshTokenRequestPayload {
  refreshToken: string;
}

export interface ErrorResponse {
  statusCode: number;
  message?: string;
  error: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserPayload {
  user: User;
}

export interface AuthenticationPayload extends UserPayload {
  payload: Tokens;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Token {
  jti: string;
  userId: string;
  device: string;
  iat: number;
}

export enum Header {
  DEVICE_ID = 'x-device-id',
}

export enum ApiResponseStatus {
  SUCCESS = 'success',
}
