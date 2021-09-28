import { Request, Response } from 'express';

interface MySession {
  session: {
    userId: number | null;
  };
}

export interface MyContext {
  req: Request & MySession;
  res: Response;
}
