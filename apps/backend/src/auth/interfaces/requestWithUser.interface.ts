import { UserDocument } from '../../user/interfaces/user.interface';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
