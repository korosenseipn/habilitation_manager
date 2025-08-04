const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery, getOne } = require('../config/database');
require('dotenv').config();

// Generate JWT tokens
const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );

    return { accessToken, refreshToken };
};

// Store refresh token in database
const storeRefreshToken = async (userId, refreshToken) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await executeQuery(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, refreshToken, expiresAt]
    );
};

// Clean expired refresh tokens
const cleanExpiredTokens = async () => {
    await executeQuery(
        'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
    );
};

// LOGIN CONTROLLER
const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await getOne(
            `SELECT u.id, u.email, u.password, u.first_name, u.last_name, 
                    u.is_active, u.email_verified, r.name as role_name, r.id as role_id
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             WHERE u.email = ?`,
            [email.toLowerCase()]
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Clean expired tokens
        await cleanExpiredTokens();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user.id);

        // Store refresh token if "remember me" is checked
        if (rememberMe) {
            await storeRefreshToken(user.id, refreshToken);
        }

        // Update last login
        await executeQuery(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    role: user.role_name,
                    roleId: user.role_id,
                    isActive: user.is_active,
                    emailVerified: user.email_verified
                },
                tokens: {
                    accessToken,
                    refreshToken: rememberMe ? refreshToken : null
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// REFRESH TOKEN CONTROLLER
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Check if refresh token exists in database
        const tokenRecord = await getOne(
            'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
            [refreshToken]
        );

        if (!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};

// LOGOUT CONTROLLER
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // Remove refresh token from database
            await executeQuery(
                'DELETE FROM refresh_tokens WHERE token = ?',
                [refreshToken]
            );
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// GET CURRENT USER CONTROLLER
const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    firstName: req.user.first_name,
                    lastName: req.user.last_name,
                    role: req.user.role_name,
                    roleId: req.user.role_id,
                    isActive: req.user.is_active
                }
            }
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    login,
    refreshToken,
    logout,
    getCurrentUser
};