import { Router } from 'express';
import { wishlistController, wishItemController } from '../controllers';
import { authMiddleware, optionalAuthMiddleware, validate } from '../middleware';
import {
  uuidParamSchema,
  wishlistIdParamSchema,
  createWishlistSchema,
  updateWishlistSchema,
  createWishItemSchema,
} from '../schemas';

const router = Router();

router.get('/', authMiddleware, wishlistController.listMine);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validate(uuidParamSchema, 'params'),
  wishlistController.getById,
);

router.post('/', authMiddleware, validate(createWishlistSchema), wishlistController.create);

router.patch(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  validate(updateWishlistSchema),
  wishlistController.update,
);

router.delete(
  '/:id',
  authMiddleware,
  validate(uuidParamSchema, 'params'),
  wishlistController.remove,
);

router.post(
  '/:wishlistId/items',
  authMiddleware,
  validate(wishlistIdParamSchema, 'params'),
  validate(createWishItemSchema),
  wishItemController.create,
);

export default router;
