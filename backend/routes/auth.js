const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
    login,
    refreshToken,
    logout,
    getCurrentUser
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation middleware
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('Remember me must be a boolean value')
];

const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Authentication Routes

// POST /api/auth/login
router.post('/login', 
    loginLimiter,
    validateLogin,
    handleValidationErrors,
    login
);

// POST /api/auth/refresh-token
router.post('/refresh-token',
    validateRefreshToken,
    handleValidationErrors,
    refreshToken
);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me - Get current user (protected route)
router.get('/me', authenticateToken, getCurrentUser);

// GET /api/auth/verify-token - Simple token verification endpoint
router.get('/verify-token', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        data: {
            userId: req.user.id,
            role: req.user.role_name
        }
    });
});

module.exports = router;