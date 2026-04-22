import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { HttpError } from '../utils/HttpError.js';

interface JwtPayload {
  userId: string;
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { userId: payload.userId };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.header('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = { userId: payload.userId };
  } catch {
  }
  next();
}
