import express from 'express';

const router = express.Router();

/**
 * @desc    Health Check Endpoint
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GreenBasket API is running',
  });
});

export default router;
