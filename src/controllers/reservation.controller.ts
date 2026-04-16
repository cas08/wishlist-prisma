import type { NextFunction, Request, Response } from 'express';
import { reservationService } from '../services/reservation.service';
import type { ReserveInput } from '../schemas/reservation.schema';
import { HttpError } from '../utils/HttpError';

export const reservationController = {
  async reserve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const reservation = await reservationService.reserve(
        id,
        req.user?.userId,
        req.body as ReserveInput,
      );
      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  },

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new HttpError(401, 'Unauthorized');
      const { id } = req.params as { id: string };
      await reservationService.cancel(id, req.user.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
