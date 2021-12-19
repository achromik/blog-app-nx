import { UserDocument } from '../../users/interfaces/user.interface';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
