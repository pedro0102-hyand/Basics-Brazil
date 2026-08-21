import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.get('/', getReviews);
router.post('/', authenticate, createReview);

export default router;