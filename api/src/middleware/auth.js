// api/src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { getOne } from '../config/database.js';
import ActivityLog from '../models/ActivityLog.js';

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No valid token provided',
                requestId: req.requestId
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get fresh user data from database
            const user = await getOne(`
                SELECT u.*, 
                       GROUP_CONCAT(DISTINCT p.permission_code) as permissions
                FROM users u
                LEFT JOIN user_permissions up ON u.id = up.user_id AND up.granted = TRUE
                LEFT JOIN permissions p ON up.permission_id = p.id
                WHERE u.id = ? AND u.is_active = TRUE
                GROUP BY u.id
            `, [decoded.id]);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. User not found or inactive',
                    requestId: req.requestId
                });
            }

            // Parse permissions
            user.permissions = user.permissions ? user.permissions.split(',') : [];

            // Add user to request object
            req.user = user;
            req.userId = user.id;
            
            next();

        } catch (jwtError) {
            let message = 'Invalid token';
            
            if (jwtError.name === 'TokenExpiredError') {
                message = 'Token expired';
            } else if (jwtError.name === 'JsonWebTokenError') {
                message = 'Invalid token format';
            }

            // Log failed authentication attempt
            await ActivityLog.create({
                type: 'security',
                action: 'Authentication Failed',
                description: `Invalid token attempt: ${message}`,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                request_method: req.method,
                request_url: req.originalUrl,
                success: false,
                severity: 'high',
                metadata: { error: jwtError.name }
            });
            
            return res.status(401).json({
                success: false,
                message,
                requestId: req.requestId
            });
        }

    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication failed',
            requestId: req.requestId
        });
    }
};

// Authorization middleware for roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. User not authenticated',
                requestId: req.requestId
            });
        }

        if (!roles.includes(req.user.role)) {
            // Log unauthorized access attempt
            ActivityLog.create({
                user_id: req.user.id,
                type: 'security',
                action: 'Unauthorized Access Attempt',
                description: `User with role '${req.user.role}' attempted to access resource requiring: ${roles.join(', ')}`,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                request_method: req.method,
                request_url: req.originalUrl,
                success: false,
                severity: 'high',
                metadata: { 
                    requiredRoles: roles,
                    userRole: req.user.role 
                }
            }).catch(err => console.error('Failed to log unauthorized access:', err));

            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions',
                required: roles,
                current: req.user.role,
                requestId: req.requestId
            });
        }

        next();
    };
};

// Permission-based authorization
export const requirePermission = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. User not authenticated',
                requestId: req.requestId
            });
        }

        const userPermissions = req.user.permissions || [];
        const hasPermission = permissions.some(permission => 
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            // Log permission denied attempt
            ActivityLog.create({
                user_id: req.user.id,
                type: 'security',
                action: 'Permission Denied',
                description: `User attempted to access resource requiring permissions: ${permissions.join(', ')}`,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                request_method: req.method,
                request_url: req.originalUrl,
                success: false,
                severity: 'medium',
                metadata: { 
                    requiredPermissions: permissions,
                    userPermissions: userPermissions 
                }
            }).catch(err => console.error('Failed to log permission denied:', err));

            return res.status(403).json({
                success: false,
                message: 'Access denied. Required permission not granted',
                required: permissions,
                requestId: req.requestId
            });
        }

        next();
    };
};

// Optional authentication (for public routes that benefit from user context)
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await getOne(`
                SELECT u.*, 
                       GROUP_CONCAT(DISTINCT p.permission_code) as permissions
                FROM users u
                LEFT JOIN user_permissions up ON u.id = up.user_id AND up.granted = TRUE
                LEFT JOIN permissions p ON up.permission_id = p.id
                WHERE u.id = ? AND u.is_active = TRUE
                GROUP BY u.id
            `, [decoded.id]);
            
            if (user) {
                user.permissions = user.permissions ? user.permissions.split(',') : [];
                req.user = user;
                req.userId = user.id;
            }
        } catch (error) {
            // Silently fail for optional auth
        }
    }
    
    next();
};

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (windowMinutes = 5, maxAttempts = 3) => {
    const attempts = new Map();
    
    return (req, res, next) => {
        const key = `${req.ip}:${req.user?.id || 'anonymous'}`;
        const now = Date.now();
        const windowMs = windowMinutes * 60 * 1000;
        
        if (!attempts.has(key)) {
            attempts.set(key, []);
        }
        
        const userAttempts = attempts.get(key);
        
        // Remove old attempts outside window
        const recentAttempts = userAttempts.filter(time => now - time < windowMs);
        attempts.set(key, recentAttempts);
        
        if (recentAttempts.length >= maxAttempts) {
            return res.status(429).json({
                success: false,
                message: `Too many sensitive operations. Try again in ${windowMinutes} minutes.`,
                retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000),
                requestId: req.requestId
            });
        }
        
        // Add current attempt
        recentAttempts.push(now);
        
        next();
    };
};

export default {
    authenticate,
    authorize,
    requirePermission,
    optionalAuth,
    sensitiveOperationLimit
};