import { Router } from 'express';
import authRoutes from './auth.routes';
import wishlistRoutes from './wishlist.routes';
import itemRoutes from './item.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/items', itemRoutes);

export default router;
