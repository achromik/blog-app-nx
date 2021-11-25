import { RefreshTokenPayload } from './refreshTokenPayload.interface';

export interface RequestWithUserID extends Request {
  user: RefreshTokenPayload;
}
