// api/src/middleware/validation.js
import { body, param, query, validationResult } from 'express-validator';
import { getOne } from '../config/database.js';


// Validation result handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            })),
            requestId: req.requestId
        });
    }
    next();
};

// Common validation rules
const emailValidation = body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address');

const passwordValidation = body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const nameValidation = (field) => body(field)
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(`${field} must be between 2 and 50 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${field} can only contain letters, spaces, hyphens, and apostrophes`);

// User validation rules
export const validateUserRegistration = [
    emailValidation,
    passwordValidation,
    nameValidation('firstName'),
    nameValidation('lastName'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department name must not exceed 100 characters'),
    body('position')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Position must not exceed 100 characters'),
    body('employeeId')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Employee ID must be between 3 and 50 characters')
        .matches(/^[A-Z0-9-]+$/)
        .withMessage('Employee ID can only contain uppercase letters, numbers, and hyphens'),
    handleValidationErrors
];

export const validateUserLogin = [
    emailValidation,
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

export const validateUserUpdate = [
    nameValidation('firstName').optional(),
    nameValidation('lastName').optional(),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department name must not exceed 100 characters'),
    body('position')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Position must not exceed 100 characters'),
    handleValidationErrors
];

export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    passwordValidation.withMessage('New password must be at least 8 characters long with uppercase, lowercase, number, and special character'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        }),
    handleValidationErrors
];

// Habilitation validation rules
export const validateHabilitation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Habilitation name must be between 3 and 200 characters'),
    body('category')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Category must be between 2 and 100 characters'),
    body('acquisitionDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid acquisition date'),
    body('expirationDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid expiration date')
        .custom((value, { req }) => {
            if (value && req.body.acquisitionDate && new Date(value) <= new Date(req.body.acquisitionDate)) {
                throw new Error('Expiration date must be after acquisition date');
            }
            return true;
        }),
    body('status')
        .optional()
        .isIn(['active', 'expired', 'pending', 'revoked', 'suspended'])
        .withMessage('Status must be one of: active, expired, pending, revoked, suspended'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),
    body('issuingAuthority')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Issuing authority must not exceed 200 characters'),
    body('certificateNumber')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Certificate number must not exceed 100 characters'),
    body('renewalPeriodMonths')
        .optional()
        .isInt({ min: 1, max: 120 })
        .withMessage('Renewal period must be between 1 and 120 months'),
    handleValidationErrors
];

// Permission validation rules
export const validatePermissionGrant = [
    body('userId')
        .isInt({ min: 1 })
        .withMessage('Valid user ID is required'),
    body('permissionId')
        .isInt({ min: 1 })
        .withMessage('Valid permission ID is required'),
    body('expiresAt')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid expiration date')
        .custom((value) => {
            if (value && new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    handleValidationErrors
];

export const validatePermissionCreate = [
    body('permissionCode')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Permission code must be between 3 and 100 characters')
        .matches(/^[a-z0-9._-]+$/)
        .withMessage('Permission code can only contain lowercase letters, numbers, dots, underscores, and hyphens'),
    body('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Permission name must be between 3 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('category')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Category must be between 2 and 100 characters'),
    body('module')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Module must be between 2 and 100 characters'),
    body('type')
        .isIn(['read', 'write', 'delete', 'admin', 'system'])
        .withMessage('Type must be one of: read, write, delete, admin, system'),
    body('riskLevel')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Risk level must be one of: low, medium, high, critical'),
    handleValidationErrors
];

// Document validation rules
export const validateDocumentUpload = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Document name must be between 1 and 255 characters'),
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    body('habilitationId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid habilitation ID is required'),
    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic must be a boolean value'),
    handleValidationErrors
];

// Pagination validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('sort')
        .optional()
        .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
        .withMessage('Sort field must be a valid column name'),
    query('order')
        .optional()
        .isIn(['asc', 'desc', 'ASC', 'DESC'])
        .withMessage('Order must be either asc or desc'),
    handleValidationErrors
];

// Search validation
export const validateSearch = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Search term must be between 2 and 100 characters'),
    query('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category filter must not exceed 100 characters'),
    query('status')
        .optional()
        .isIn(['active', 'expired', 'pending', 'revoked', 'suspended'])
        .withMessage('Status must be one of: active, expired, pending, revoked, suspended'),
    query('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Priority must be one of: low, medium, high, critical'),
    query('department')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Department filter must not exceed 100 characters'),
    handleValidationErrors
];

// ID parameter validation
export const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    handleValidationErrors
];

export const validateUUID = [
    param('uuid')
        .isUUID()
        .withMessage('UUID must be a valid UUID format'),
    handleValidationErrors
];

// Activity log filters validation
export const validateActivityFilters = [
    query('type')
        .optional()
        .isIn(['auth', 'habilitation', 'permission', 'profile', 'system', 'security', 'error'])
        .withMessage('Type must be one of: auth, habilitation, permission, profile, system, security, error'),
    query('severity')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Severity must be one of: low, medium, high, critical'),
    query('success')
        .optional()
        .isBoolean()
        .withMessage('Success must be a boolean value'),
    query('startDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid start date'),
    query('endDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid end date')
        .custom((value, { req }) => {
            if (value && req.query.startDate && new Date(value) <= new Date(req.query.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),
    handleValidationErrors
];

// Report validation
export const validateReportRequest = [
    body('reportType')
        .isIn(['habilitations', 'users', 'permissions', 'activity', 'expiring'])
        .withMessage('Report type must be one of: habilitations, users, permissions, activity, expiring'),
    body('format')
        .optional()
        .isIn(['json', 'csv', 'pdf'])
        .withMessage('Format must be one of: json, csv, pdf'),
    body('filters')
        .optional()
        .isObject()
        .withMessage('Filters must be an object'),
    body('dateRange')
        .optional()
        .isObject()
        .withMessage('Date range must be an object'),
    body('dateRange.startDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Start date must be a valid date'),
    body('dateRange.endDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('End date must be a valid date'),
    handleValidationErrors
];

// File validation
export const validateFileUpload = (req, res, next) => {
    if (!req.file && !req.files) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded',
            requestId: req.requestId
        });
    }

    const file = req.file || (req.files && req.files[0]);
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.jpg,.jpeg,.png,.pdf,.doc,.docx').split(',');
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB

    if (file.size > maxSize) {
        return res.status(400).json({
            success: false,
            message: `File size too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`,
            requestId: req.requestId
        });
    }

    const fileExt = '.' + file.originalname.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
        return res.status(400).json({
            success: false,
            message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
            requestId: req.requestId
        });
    }

    next();
};

// Custom validators
export const customValidators = {
    // Check if user exists
    userExists: async (value) => {
        const user = await getOne('SELECT id FROM users WHERE id = ? AND is_active = TRUE', [value]);
        if (!user) {
            throw new Error('User does not exist');
        }
        return true;
    },

    // Check if email is unique
    emailUnique: async (value, { req }) => {
        let query = 'SELECT id FROM users WHERE email = ?';
        let params = [value];
        
        // Exclude current user for updates
        if (req.user && req.user.id) {
            query += ' AND id != ?';
            params.push(req.user.id);
        }
        
        const user = await getOne(query, params);
        if (user) {
            throw new Error('Email already exists');
        }
        return true;
    },

    // Check if employee ID is unique
    employeeIdUnique: async (value, { req }) => {
        if (!value) return true; // Optional field
        
        let query = 'SELECT id FROM users WHERE employee_id = ?';
        let params = [value];
        
        // Exclude current user for updates
        if (req.user && req.user.id) {
            query += ' AND id != ?';
            params.push(req.user.id);
        }
        
        const user = await getOne(query, params);
        if (user) {
            throw new Error('Employee ID already exists');
        }
        return true;
    },

    // Check if habilitation code is unique
    habilitationCodeUnique: async (value, { req }) => {
        let query = 'SELECT id FROM habilitations WHERE habilitation_code = ?';
        let params = [value];
        
        // Exclude current habilitation for updates
        if (req.params && req.params.id) {
            query += ' AND id != ?';
            params.push(req.params.id);
        }
        
        const habilitation = await getOne(query, params);
        if (habilitation) {
            throw new Error('Habilitation code already exists');
        }
        return true;
    }
};

export default {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validatePasswordChange,
    validateHabilitation,
    validatePermissionGrant,
    validatePermissionCreate,
    validateDocumentUpload,
    validatePagination,
    validateSearch,
    validateId,
    validateUUID,
    validateActivityFilters,
    validateReportRequest,
    validateFileUpload,
    customValidators
};
export { getOne };