// api/src/models/User.js
import bcrypt from 'bcryptjs';
import { executeQuery, getOne } from '../config/database.js';

class User {
    constructor(userData) {
        this.email = userData.email;
        this.password = userData.password;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.phone = userData.phone;
        this.department = userData.department;
        this.position = userData.position;
        this.employeeId = userData.employeeId;
        this.profileImage = userData.profileImage;
        this.role = userData.role || 'employee';
        this.isActive = userData.isActive !== undefined ? userData.isActive : true;
        this.emailVerified = userData.emailVerified || false;
    }

    // Create new user
    async save() {
        const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
        
        const query = `
            INSERT INTO users (email, password, first_name, last_name, phone, department, 
                             position, employee_id, profile_image, role, is_active, email_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            this.email,
            hashedPassword,
            this.firstName,
            this.lastName,
            this.phone,
            this.department,
            this.position,
            this.employeeId,
            this.profileImage,
            this.role,
            this.isActive,
            this.emailVerified
        ];

        try {
            const result = await executeQuery(query, params);
            const savedUser = await User.findById(result.insertId);
            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        const query = `
            SELECT * FROM users 
            WHERE email = ? AND is_active = TRUE
        `;
        return await getOne(query, [email]);
    }

    // Find user by ID
    static async findById(id) {
        const query = `
            SELECT id, uuid, email, first_name, last_name, phone, department, 
                   position, employee_id, profile_image, role, is_active, 
                   email_verified, last_login, created_at, updated_at
            FROM users 
            WHERE id = ? AND is_active = TRUE
        `;
        return await getOne(query, [id]);
    }

    // Find user by UUID
    static async findByUUID(uuid) {
        const query = `
            SELECT id, uuid, email, first_name, last_name, phone, department, 
                   position, employee_id, profile_image, role, is_active, 
                   email_verified, last_login, created_at, updated_at
            FROM users 
            WHERE uuid = ? AND is_active = TRUE
        `;
        return await getOne(query, [uuid]);
    }

    // Find user by employee ID
    static async findByEmployeeId(employeeId) {
        const query = `
            SELECT * FROM users 
            WHERE employee_id = ? AND is_active = TRUE
        `;
        return await getOne(query, [employeeId]);
    }

    // Get all users with pagination and filters
    static async findAll(page = 1, limit = 10, filters = {}) {
        let query = `
            SELECT id, uuid, email, first_name, last_name, phone, department, 
                   position, employee_id, role, is_active, email_verified,
                   last_login, created_at, updated_at
            FROM users 
            WHERE 1=1
        `;
        let params = [];

        // Add filters
        if (filters.department) {
            query += ' AND department = ?';
            params.push(filters.department);
        }
        if (filters.role) {
            query += ' AND role = ?';
            params.push(filters.role);
        }
        if (filters.isActive !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.isActive);
        }
        if (filters.emailVerified !== undefined) {
            query += ' AND email_verified = ?';
            params.push(filters.emailVerified);
        }
        if (filters.search) {
            query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
            const searchParam = `%${filters.search}%`;
            params.push(searchParam, searchParam, searchParam, searchParam);
        }

        // Add sorting
        const sortField = filters.sort || 'created_at';
        const sortOrder = filters.order || 'DESC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const users = await executeQuery(query, params);
        
        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        let countParams = [];
        
        // Apply same filters for count
        if (filters.department) {
            countQuery += ' AND department = ?';
            countParams.push(filters.department);
        }
        if (filters.role) {
            countQuery += ' AND role = ?';
            countParams.push(filters.role);
        }
        if (filters.isActive !== undefined) {
            countQuery += ' AND is_active = ?';
            countParams.push(filters.isActive);
        }
        if (filters.emailVerified !== undefined) {
            countQuery += ' AND email_verified = ?';
            countParams.push(filters.emailVerified);
        }
        if (filters.search) {
            countQuery += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR employee_id LIKE ?)';
            const searchParam = `%${filters.search}%`;
            countParams.push(searchParam, searchParam, searchParam, searchParam);
        }

        const [{ total }] = await executeQuery(countQuery, countParams);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        };
    }

    // Update user
    static async update(id, userData) {
        let query = 'UPDATE users SET ';
        let params = [];
        let updates = [];

        // Build dynamic update query
        const allowedFields = [
            'first_name', 'last_name', 'phone', 'department', 
            'position', 'profile_image', 'email_verified'
        ];
        
        Object.keys(userData).forEach(key => {
            const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (allowedFields.includes(dbField)) {
                updates.push(`${dbField} = ?`);
                params.push(userData[key]);
            }
        });

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        updates.push('updated_at = CURRENT_TIMESTAMP');
        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        await executeQuery(query, params);
        return await User.findById(id);
    }

    // Update user role (admin only)
    static async updateRole(id, role) {
        const query = `
            UPDATE users 
            SET role = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await executeQuery(query, [role, id]);
        return await User.findById(id);
    }

    // Update last login
    static async updateLastLogin(id) {
        const query = `
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await executeQuery(query, [id]);
    }

    // Deactivate user (soft delete)
    static async deactivate(id) {
        const query = `
            UPDATE users 
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await executeQuery(query, [id]);
    }

    // Activate user
    static async activate(id) {
        const query = `
            UPDATE users 
            SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await executeQuery(query, [id]);
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Change password
    static async changePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);
        const query = `
            UPDATE users 
            SET password = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        await executeQuery(query, [hashedPassword, id]);
    }

    // Get user with permissions
    static async findWithPermissions(id) {
        const query = `
            SELECT u.*, 
                   GROUP_CONCAT(
                       DISTINCT CONCAT(p.permission_code, ':', up.granted)
                   ) as permissions
            FROM users u
            LEFT JOIN user_permissions up ON u.id = up.user_id
            LEFT JOIN permissions p ON up.permission_id = p.id
            WHERE u.id = ? AND u.is_active = TRUE
            GROUP BY u.id
        `;
        
        const user = await getOne(query, [id]);
        
        if (user && user.permissions) {
            user.permissions = user.permissions.split(',').reduce((acc, perm) => {
                const [code, granted] = perm.split(':');
                acc[code] = granted === '1';
                return acc;
            }, {});
        } else {
            user.permissions = {};
        }
        
        return user;
    }

    // Get user statistics
    static async getStats() {
        const query = `
            SELECT 
                COUNT(*) as total_users,
                SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_users,
                SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as inactive_users,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
                SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) as manager_count,
                SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) as employee_count,
                SUM(CASE WHEN role = 'viewer' THEN 1 ELSE 0 END) as viewer_count,
                SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
                SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as active_last_30_days
            FROM users
        `;
        
        return await getOne(query);
    }

    // Get department statistics
    static async getDepartmentStats() {
        const query = `
            SELECT 
                department,
                COUNT(*) as user_count,
                SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_count
            FROM users
            WHERE department IS NOT NULL AND department != ''
            GROUP BY department
            ORDER BY user_count DESC
        `;
        
        return await executeQuery(query);
    }

    // Search users
    static async search(searchTerm, limit = 10) {
        const query = `
            SELECT id, uuid, first_name, last_name, email, department, position, role
            FROM users
            WHERE is_active = TRUE
            AND (
                first_name LIKE ? OR 
                last_name LIKE ? OR 
                email LIKE ? OR 
                employee_id LIKE ? OR
                department LIKE ?
            )
            ORDER BY 
                CASE 
                    WHEN first_name LIKE ? THEN 1
                    WHEN last_name LIKE ? THEN 2
                    WHEN email LIKE ? THEN 3
                    ELSE 4
                END,
                first_name, last_name
            LIMIT ?
        `;
        
        const searchParam = `%${searchTerm}%`;
        const exactParam = `${searchTerm}%`;
        
        return await executeQuery(query, [
            searchParam, searchParam, searchParam, searchParam, searchParam,
            exactParam, exactParam, exactParam,
            limit
        ]);
    }
}

export default User;