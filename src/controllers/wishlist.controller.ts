import type { NextFunction, Request, Response } from 'express';
import { wishlistService } from '../services/wishlist.service';
import type { CreateWishlistInput, UpdateWishlistInput } from '../schemas/wishlist.schema';
import { HttpError } from '../utils/HttpError';

export const wishlistController = {
  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const data = await wishlistService.listMine(req.user.userId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const data = await wishlistService.getById(id, req.user?.userId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const created = await wishlistService.create(
        req.user.userId,
        req.body as CreateWishlistInput,
      );
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const { id } = req.params as { id: string };
      const updated = await wishlistService.update(
        id,
        req.user.userId,
        req.body as UpdateWishlistInput,
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const { id } = req.params as { id: string };
      await wishlistService.remove(id, req.user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
