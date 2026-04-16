import { Router } from 'express';
import { wishItemController } from '../controllers/wishitem.controller';
import { reservationController } from '../controllers/reservation.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema } from '../schemas/common.schema';
import { updateWishItemSchema } from '../schemas/wishitem.schema';
import { reserveSchema } from '../schemas/reservation.schema';

const router = Router();

router.patch(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(updateWishItemSchema),
  wishItemController.update,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  wishItemController.remove,
);

router.post(
  '/:id/reserve',
  optionalAuthMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(reserveSchema),
  reservationController.reserve,
);

router.delete(
  '/:id/reserve',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  reservationController.cancel,
);

export default router;
