import { Router } from 'express';
import { register, login, me, uploadAvatar } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { avatarUpload } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.post('/avatar', authenticate, avatarUpload.single('avatar'), uploadAvatar);

export default router;