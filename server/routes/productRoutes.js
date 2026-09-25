import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getMyProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/my-products', protect, getMyProducts);
router.get('/:id', getProductByIdOrSlug);

// User & Admin Protected Routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
