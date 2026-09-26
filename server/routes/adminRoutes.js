import express from 'express';
import {
  getAdminStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminUsers,
  getAdminSellers,
  getAdminBuyers,
} from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require valid Firebase Auth for all admin endpoints



// Strictly Protected Admin Endpoints
router.get('/stats', requireAdmin, getAdminStats);

router.get('/products', requireAdmin, getAdminProducts);
router.post('/products', requireAdmin, createAdminProduct);
router.put('/products/:id', requireAdmin, updateAdminProduct);
router.delete('/products/:id', requireAdmin, deleteAdminProduct);

router.get('/orders', requireAdmin, getAdminOrders);
router.put('/orders/:id/status', requireAdmin, updateAdminOrderStatus);

router.get('/users', requireAdmin, getAdminUsers);
router.get('/sellers', requireAdmin, getAdminSellers);
router.get('/buyers', requireAdmin, getAdminBuyers);

export default router;
