import { Router } from 'express';
import { authController } from '../controllers';
import { authMiddleware, validate } from '../middleware';
import { loginSchema, registerSchema } from '../schemas';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
