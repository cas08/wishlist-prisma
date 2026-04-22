import type { Request, Response } from 'express';
import { authService } from '../services/';
import type { LoginInput, RegisterInput } from '../schemas/';
import { HttpError } from '../utils/HttpError';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json(result);
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body as LoginInput);
    res.json(result);
  },

  async me(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const user = await authService.me(req.user.userId);
    res.json(user);
  },
};
