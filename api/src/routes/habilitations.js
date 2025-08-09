import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/habilitations - Get habilitations
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Habilitations endpoint - coming soon',
        requestId: req.requestId
    });
});

export default router;