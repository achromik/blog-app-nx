export interface RequestWithUserEmail extends Request {
  user: {
    email: string;
  };
}
