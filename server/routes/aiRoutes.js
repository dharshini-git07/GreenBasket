import express from 'express';
import { handleGreenGuideQuery } from '../controllers/aiController.js';

const router = express.Router();

/**
 * @route   POST /api/ai/green-guide
 * @desc    Get grounded sustainable product recommendations from GreenGuide AI
 * @access  Public
 */
router.post('/green-guide', handleGreenGuideQuery);

export default router;
