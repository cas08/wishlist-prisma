import { Router } from 'express';
import { wishItemController, reservationController } from '../controllers';
import { authMiddleware, optionalAuthMiddleware, validate } from '../middleware/';
import { uuidParamSchema, updateWishItemSchema, reserveSchema } from '../schemas/';

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
