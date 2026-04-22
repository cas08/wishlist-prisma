import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authMiddleware, validate } from '../middleware/index.js';
import { loginSchema, registerSchema } from '../schemas/index.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
