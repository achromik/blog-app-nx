export function types(): string {
  return 'types';
}

export interface LoginUserResponse {
  message: string;
  access_token: string;
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
