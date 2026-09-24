import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all cart routes

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItemQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
