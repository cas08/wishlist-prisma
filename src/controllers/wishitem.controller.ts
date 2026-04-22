import type { Request, Response } from 'express';
import { wishItemService } from '../services/';
import type { CreateWishItemInput, UpdateWishItemInput } from '../schemas/';
import { HttpError } from '../utils/HttpError';

export const wishItemController = {
  async create(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { wishlistId } = req.params as { wishlistId: string };
    const created = await wishItemService.create(
      wishlistId,
      req.user.userId,
      req.body as CreateWishItemInput,
    );
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { id } = req.params as { id: string };
    const updated = await wishItemService.update(
      id,
      req.user.userId,
      req.body as UpdateWishItemInput,
    );
    res.json(updated);
  },

  async remove(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { id } = req.params as { id: string };
    await wishItemService.remove(id, req.user.userId);
    res.status(204).send();
  },
};
