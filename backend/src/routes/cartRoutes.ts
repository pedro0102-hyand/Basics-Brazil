import {Router} from 'express';
import {getCart, addToCart, updateCartItem, removeCartItem} from '../controllers/cartController';
import {authenticate} from '../middleware/auth';

// Create a new router instance
const router = Router();

// Get the authenticated user's cart items
router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.put('/:itemId', authenticate, updateCartItem);
router.delete('/:itemId', authenticate, removeCartItem);

export default router;