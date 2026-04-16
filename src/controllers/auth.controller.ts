import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { HttpError } from '../utils/HttpError';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body as RegisterInput);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body as LoginInput);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const user = await authService.me(req.user.userId);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
