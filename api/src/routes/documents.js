import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/documents - Get documents
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Documents endpoint - coming soon',
        requestId: req.requestId
    });
});

export default router;