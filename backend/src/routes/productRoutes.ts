import {Router} from 'express';
import { getProducts, getProductById, createProduct} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, authorize('admin'), createProduct);
router.get('/:id', getProductById);

export default router;