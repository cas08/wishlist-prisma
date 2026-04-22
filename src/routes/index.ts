import { Router } from 'express';
import authRoutes from './auth.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import itemRoutes from './item.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/items', itemRoutes);

export default router;
