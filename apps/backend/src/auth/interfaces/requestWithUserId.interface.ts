import { RefreshTokenPayload } from './refreshTokenPayload.interface';

export interface RequestWithUserId extends Request {
  user: RefreshTokenPayload;
}
