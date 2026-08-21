import { Router } from 'express';
import { getComments, createComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', authenticate, createComment);

export default router;