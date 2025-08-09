// api/src/routes/auth.js (Version simplifiée pour debug)
import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, sensitiveOperationLimit } from '../middleware/auth.js';
import { executeQuery, getOne } from '../config/database.js';

const router = express.Router();

// Rate limiting pour auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Plus généreux pour les tests
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'test'
});

// Generate JWT tokens
const generateTokens = (user) => {
    const payload = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    const refreshToken = jwt.sign(
        { id: user.id, uuid: user.uuid, tokenType: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

// Store refresh token
const storeRefreshToken = async (userId, refreshToken, deviceInfo, ipAddress) => {
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    
    const query = `
        INSERT INTO refresh_tokens (token, user_id, device_info, ip_address, expires_at) 
        VALUES (?, ?, ?, ?, ?)
    `;
    await executeQuery(query, [refreshToken, userId, deviceInfo, ipAddress, expiresAt]);
};

// POST /api/v1/auth/login - AVEC LOGS DÉTAILLÉS
router.post('/login', authLimiter, async (req, res, next) => {
    try {
        console.log('🔍 === DÉBUT LOGIN ===');
        console.log('🔍 Request body:', req.body);
        console.log('🔍 IP:', req.ip);
        console.log('🔍 User-Agent:', req.get('User-Agent'));
        
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                requestId: req.requestId || 'unknown'
            });
        }

        console.log('🔍 Searching for email EXACTLY:', `"${email}"`);

        // Find user by email avec log détaillé
        const userWithPassword = await getOne(`
            SELECT * FROM users 
            WHERE email = ? AND is_active = TRUE
        `, [email]);

        console.log('🔍 Query result:');
        if (userWithPassword) {
            console.log('  ✅ User found:');
            console.log('    - ID:', userWithPassword.id);
            console.log('    - Email:', `"${userWithPassword.email}"`);
            console.log('    - Name:', userWithPassword.first_name, userWithPassword.last_name);
            console.log('    - Role:', userWithPassword.role);
            console.log('    - Employee ID:', userWithPassword.employee_id);
            console.log('    - Active:', userWithPassword.is_active);
        } else {
            console.log('  ❌ No user found');
            
            // Debug: chercher tous les utilisateurs pour voir ce qu'il y a
            const allUsers = await executeQuery('SELECT id, email, first_name, role FROM users WHERE is_active = TRUE');
            console.log('🔍 All active users in database:');
            allUsers.forEach(u => console.log(`    - ${u.id}: "${u.email}" (${u.first_name} - ${u.role})`));
        }

        if (!userWithPassword) {
            console.log('❌ Authentication failed - user not found');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                requestId: req.requestId || 'unknown'
            });
        }

        console.log('🔍 Verifying password...');
        const isPasswordValid = await User.verifyPassword(password, userWithPassword.password);
        console.log('🔍 Password verification result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Authentication failed - invalid password');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                requestId: req.requestId || 'unknown'
            });
        }

        console.log('✅ Authentication successful!');
        console.log('🔍 Retrieving clean user data...');

        // Get user without password
        const user = await User.findById(userWithPassword.id);
        
        console.log('🔍 Clean user data retrieved:');
        console.log('    - ID:', user.id);
        console.log('    - Email:', user.email);
        console.log('    - Name:', user.first_name, user.last_name);
        console.log('    - Role:', user.role);

        // Generate tokens
        console.log('🔍 Generating tokens...');
        const { accessToken, refreshToken } = generateTokens(user);
        
        console.log('🔍 Token payload will contain:');
        console.log('    - User ID:', user.id);
        console.log('    - Email:', user.email);
        console.log('    - Role:', user.role);
        console.log('    - Name:', user.first_name, user.last_name);

        const deviceInfo = req.get('User-Agent') || 'Unknown Device';
        
        try {
            await storeRefreshToken(user.id, refreshToken, deviceInfo, req.ip);
            await User.updateLastLogin(user.id);
            console.log('✅ Tokens stored and last login updated');
        } catch (error) {
            console.log('⚠️ Non-critical error:', error.message);
        }

        const response = {
            success: true,
            message: 'Login successful',
            data: {
                user,
                accessToken,
                refreshToken
            },
            requestId: req.requestId || 'unknown'
        };

        console.log('🔍 Final response user data:');
        console.log('    - ID:', response.data.user.id);
        console.log('    - Email:', response.data.user.email);
        console.log('    - Role:', response.data.user.role);
        console.log('🔍 === FIN LOGIN ===\n');

        res.json(response);

    } catch (error) {
        console.error('💥 Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            requestId: req.requestId || 'unknown'
        });
    }
});

// Autres routes simplifiées...
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logout successful' });
});

router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, data: { user } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;