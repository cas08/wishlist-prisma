import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { wishItemController } from '../controllers/wishitem.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { uuidParamSchema, wishlistIdParamSchema } from '../schemas/common.schema';
import { createWishlistSchema, updateWishlistSchema } from '../schemas/wishlist.schema';
import { createWishItemSchema } from '../schemas/wishitem.schema';

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
