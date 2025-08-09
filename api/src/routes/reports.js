import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/reports - Get reports
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Reports endpoint - coming soon',
        requestId: req.requestId
    });
});

export default router;