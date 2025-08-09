import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/permissions - Get permissions
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Permissions endpoint - coming soon',
        requestId: req.requestId
    });
});

export default router;