import type { Request, Response } from 'express';
import { wishlistService } from '../services/index.js';
import type { CreateWishlistInput, UpdateWishlistInput } from '../schemas/index.js';
import { HttpError } from '../utils/HttpError.js';

export const wishlistController = {
  async listMine(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const data = await wishlistService.listMine(req.user.userId);
    res.json(data);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const data = await wishlistService.getById(id, req.user?.userId);
    res.json(data);
  },

  async create(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const created = await wishlistService.create(
      req.user.userId,
      req.body as CreateWishlistInput,
    );
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { id } = req.params as { id: string };
    const updated = await wishlistService.update(
      id,
      req.user.userId,
      req.body as UpdateWishlistInput,
    );
    res.json(updated);
  },

  async remove(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { id } = req.params as { id: string };
    await wishlistService.remove(id, req.user.userId);
    res.status(204).send();
  },
};
