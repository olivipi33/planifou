
import { Request, Response, NextFunction } from 'express';
import { getAPIToken, loginPlanitou } from '../planitou';

export const isAuthenticated = async (req: Request, _: Response, next: NextFunction) => {
  if (req.session.token) {
    return next();
  } else {
    const username = process.env.PLANITOU_USERNAME;
    const password = process.env.PLANITOU_PASSWORD;

    if (!username || !password) {
      return next('Passord or username is missing.');
    }

    const login = await loginPlanitou(username, password);
    if (login.status === 'error') {
      return next('Fail to login.');
    }

    const apiToken = await getAPIToken(login.data.token);
    if (!apiToken) {
      return next('Failed to get API Token.');
    }
    req.session.token = apiToken;
    next();
  }
} 