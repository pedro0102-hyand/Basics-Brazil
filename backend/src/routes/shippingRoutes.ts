import { Router } from 'express';
import { calculateShipping } from '../controllers/shippingController';
import { authenticate } from '../middleware/auth';

// Create a new router instance
const router = Router();

// Calculate shipping cost based on total weight
router.post('/calculate', authenticate, calculateShipping);

export default router;