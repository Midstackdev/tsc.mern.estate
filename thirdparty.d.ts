declare namespace Express {
  export interface Request {
    reqId: string;
    log: Logger;
    user: IUser;
  }
}
