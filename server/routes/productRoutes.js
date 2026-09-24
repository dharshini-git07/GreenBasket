import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductByIdOrSlug);

// Admin Routes (Prepared for Module 3 protection)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
