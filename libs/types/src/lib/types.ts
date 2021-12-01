export function types(): string {
  return 'types';
}
interface Response {
  status: string;
}
export interface AuthResponse extends Response {
  data: AuthenticationPayload;
}

export interface RegisterUserResponse extends Response {
  data: UserPayload;
}

export interface LoginData {
  email: string;
  password: string;
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
