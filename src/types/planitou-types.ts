import * as Express from 'express';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
}

export interface Request extends Express.Request {
  session: session.Session & Partial<session.SessionData>;
}