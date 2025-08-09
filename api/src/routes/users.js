import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users - Get all users (admin/manager only)
router.get('/', authorize('admin', 'manager'), (req, res) => {
    res.json({
        success: true,
        message: 'Users endpoint - coming soon',
        requestId: req.requestId
    });
});

export default router;