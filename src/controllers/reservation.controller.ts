import type { Request, Response } from 'express';
import { reservationService } from '../services';
import type { ReserveInput } from '../schemas/';
import { HttpError } from '../utils/HttpError';

export const reservationController = {
  async reserve(req: Request, res: Response) {
    const { id } = req.params as { id: string };
    const reservation = await reservationService.reserve(
      id,
      req.user?.userId,
      req.body as ReserveInput,
    );
    res.status(201).json(reservation);
  },

  async cancel(req: Request, res: Response) {
    if (!req.user) throw new HttpError(401, 'Unauthorized');
    const { id } = req.params as { id: string };
    await reservationService.cancel(id, req.user.userId);
    res.status(204).send();
  },
};
