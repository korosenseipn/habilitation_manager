// api/src/models/ActivityLog.js

import { executeQuery, getOne } from '../config/database.js';

class ActivityLog {
    constructor(logData) {
        this.activityCode = logData.activityCode || `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        this.userId = logData.userId || logData.user_id || null;  // ✅ AJOUT de || null
        this.type = logData.type;
        this.action = logData.action;
        this.description = logData.description || null;  // ✅ AJOUT de || null
        this.targetType = logData.targetType || null;  // ✅ AJOUT de || null
        this.targetId = logData.targetId || null;  // ✅ AJOUT de || null
        this.ipAddress = logData.ipAddress || logData.ip_address || null;  // ✅ AJOUT de || null
        this.userAgent = logData.userAgent || logData.user_agent || null;  // ✅ AJOUT de || null
        this.requestMethod = logData.requestMethod || logData.request_method || null;  // ✅ AJOUT de || null
        this.requestUrl = logData.requestUrl || logData.request_url || null;  // ✅ AJOUT de || null
        this.responseStatus = logData.responseStatus || logData.response_status || null;  // ✅ AJOUT de || null
        this.success = logData.success !== undefined ? logData.success : true;
        this.severity = logData.severity || 'medium';
        this.metadata = logData.metadata ? JSON.stringify(logData.metadata) : null;
    }

    // Create new activity log
    static async create(logData) {
        const log = new ActivityLog(logData);
        
        const query = `
            INSERT INTO activity_logs (activity_code, user_id, type, action, description, 
                                     target_type, target_id, ip_address, user_agent, 
                                     request_method, request_url, response_status,
                                     success, severity, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            log.activityCode,
            log.userId,
            log.type,
            log.action,
            log.description,
            log.targetType,
            log.targetId,
            log.ipAddress,
            log.userAgent,
            log.requestMethod,
            log.requestUrl,
            log.responseStatus,
            log.success,
            log.severity,
            log.metadata
        ];

        try {
            const result = await executeQuery(query, params);
            return { id: result.insertId, ...log };
        } catch (error) {
            console.error('Failed to create activity log:', error);
            // Don't throw error to prevent disrupting main operations
            return null;
        }
    }

    // Get activity logs with pagination and filters
    static async findAll(page = 1, limit = 20, filters = {}) {
        let query = `
            SELECT al.*, 
                   u.first_name, u.last_name, u.email, u.employee_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        let params = [];

        // Add filters
        if (filters.userId) {
            query += ' AND al.user_id = ?';
            params.push(filters.userId);
        }
        if (filters.type) {
            query += ' AND al.type = ?';
            params.push(filters.type);
        }
        if (filters.action) {
            query += ' AND al.action LIKE ?';
            params.push(`%${filters.action}%`);
        }
        if (filters.severity) {
            query += ' AND al.severity = ?';
            params.push(filters.severity);
        }
        if (filters.success !== undefined) {
            query += ' AND al.success = ?';
            params.push(filters.success);
        }
        if (filters.startDate) {
            query += ' AND al.created_at >= ?';
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            query += ' AND al.created_at <= ?';
            params.push(filters.endDate);
        }
        if (filters.ipAddress) {
            query += ' AND al.ip_address = ?';
            params.push(filters.ipAddress);
        }
        if (filters.search) {
            query += ' AND (al.action LIKE ? OR al.description LIKE ? OR al.activity_code LIKE ?)';
            const searchParam = `%${filters.search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        // Add sorting
        const sortField = filters.sort || 'created_at';
        const sortOrder = filters.order || 'DESC';
        query += ` ORDER BY al.${sortField} ${sortOrder}`;

        // Add pagination
        const offset = (page - 1) * limit;
        query += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const logs = await executeQuery(query, params);
        
        // Parse metadata JSON
        const processedLogs = logs.map(log => ({
            ...log,
            metadata: log.metadata ? JSON.parse(log.metadata) : null
        }));

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        let countParams = [];
        
        // Apply same filters for count
        if (filters.userId) {
            countQuery += ' AND al.user_id = ?';
            countParams.push(filters.userId);
        }
        if (filters.type) {
            countQuery += ' AND al.type = ?';
            countParams.push(filters.type);
        }
        if (filters.action) {
            countQuery += ' AND al.action LIKE ?';
            countParams.push(`%${filters.action}%`);
        }
        if (filters.severity) {
            countQuery += ' AND al.severity = ?';
            countParams.push(filters.severity);
        }
        if (filters.success !== undefined) {
            countQuery += ' AND al.success = ?';
            countParams.push(filters.success);
        }
        if (filters.startDate) {
            countQuery += ' AND al.created_at >= ?';
            countParams.push(filters.startDate);
        }
        if (filters.endDate) {
            countQuery += ' AND al.created_at <= ?';
            countParams.push(filters.endDate);
        }
        if (filters.ipAddress) {
            countQuery += ' AND al.ip_address = ?';
            countParams.push(filters.ipAddress);
        }
        if (filters.search) {
            countQuery += ' AND (al.action LIKE ? OR al.description LIKE ? OR al.activity_code LIKE ?)';
            const searchParam = `%${filters.search}%`;
            countParams.push(searchParam, searchParam, searchParam);
        }

        const [{ total }] = await executeQuery(countQuery, countParams);

        return {
            logs: processedLogs,
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

    // Get activity log by ID
    static async findById(id) {
        const query = `
            SELECT al.*, 
                   u.first_name, u.last_name, u.email, u.employee_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.id = ?
        `;
        
        const log = await getOne(query, [id]);
        
        if (log && log.metadata) {
            log.metadata = JSON.parse(log.metadata);
        }
        
        return log;
    }

    // Get activity log by activity code
    static async findByActivityCode(activityCode) {
        const query = `
            SELECT al.*, 
                   u.first_name, u.last_name, u.email, u.employee_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.activity_code = ?
        `;
        
        const log = await getOne(query, [activityCode]);
        
        if (log && log.metadata) {
            log.metadata = JSON.parse(log.metadata);
        }
        
        return log;
    }

    // Get user activity summary
    static async getUserActivitySummary(userId, days = 30) {
        const query = `
            SELECT 
                type,
                COUNT(*) as count,
                SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failure_count,
                MAX(created_at) as last_activity
            FROM activity_logs 
            WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY type
            ORDER BY count DESC
        `;
        
        return await executeQuery(query, [userId, days]);
    }

    // Get system activity stats
    static async getSystemStats(days = 7) {
        const query = `
            SELECT 
                DATE(created_at) as date,
                type,
                severity,
                COUNT(*) as count,
                SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failure_count
            FROM activity_logs 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at), type, severity
            ORDER BY date DESC, count DESC
        `;
        
        return await executeQuery(query, [days]);
    }

    // Get security alerts (failed attempts, high severity events)
    static async getSecurityAlerts(limit = 50) {
        const query = `
            SELECT al.*, 
                   u.first_name, u.last_name, u.email, u.employee_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE (al.success = FALSE OR al.severity IN ('high', 'critical'))
            AND al.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            ORDER BY 
                CASE al.severity 
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'medium' THEN 3
                    WHEN 'low' THEN 4
                END,
                al.created_at DESC
            LIMIT ?
        `;
        
        const alerts = await executeQuery(query, [limit]);
        
        return alerts.map(alert => ({
            ...alert,
            metadata: alert.metadata ? JSON.parse(alert.metadata) : null
        }));
    }

    // Get failed login attempts by IP
    static async getFailedLoginsByIP(hours = 24, limit = 20) {
        const query = `
            SELECT 
                ip_address,
                COUNT(*) as attempts,
                MAX(created_at) as last_attempt,
                GROUP_CONCAT(DISTINCT user_agent SEPARATOR '; ') as user_agents
            FROM activity_logs
            WHERE type = 'auth' 
            AND action LIKE '%Failed%'
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            GROUP BY ip_address
            HAVING attempts >= 3
            ORDER BY attempts DESC, last_attempt DESC
            LIMIT ?
        `;
        
        return await executeQuery(query, [hours, limit]);
    }

    // Clean old activity logs (retention policy)
    static async cleanOldLogs(retentionDays = 90) {
        const query = `
            DELETE FROM activity_logs 
            WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
            AND severity NOT IN ('high', 'critical')
        `;
        
        try {
            const result = await executeQuery(query, [retentionDays]);
            console.log(`Cleaned ${result.affectedRows} old activity logs`);
            return result.affectedRows;
        } catch (error) {
            console.error('Failed to clean old activity logs:', error);
            return 0;
        }
    }

    // Get most active users
    static async getMostActiveUsers(limit = 10, days = 30) {
        const query = `
            SELECT 
                u.id,
                u.uuid,
                u.first_name,
                u.last_name,
                u.email,
                u.employee_id,
                u.role,
                u.department,
                COUNT(al.id) as activity_count,
                MAX(al.created_at) as last_activity,
                COUNT(DISTINCT DATE(al.created_at)) as active_days
            FROM users u
            INNER JOIN activity_logs al ON u.id = al.user_id
            WHERE al.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            AND u.is_active = TRUE
            GROUP BY u.id, u.uuid, u.first_name, u.last_name, u.email, 
                     u.employee_id, u.role, u.department
            ORDER BY activity_count DESC
            LIMIT ?
        `;
        
        return await executeQuery(query, [days, limit]);
    }

    // Get activity trends
    static async getActivityTrends(days = 30) {
        const query = `
            SELECT 
                DATE(created_at) as date,
                HOUR(created_at) as hour,
                COUNT(*) as activity_count,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failed_count
            FROM activity_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at), HOUR(created_at)
            ORDER BY date DESC, hour DESC
        `;
        
        return await executeQuery(query, [days]);
    }

    // Get activity by type statistics
    static async getActivityByType(days = 30) {
        const query = `
            SELECT 
                type,
                COUNT(*) as total_count,
                COUNT(DISTINCT user_id) as unique_users,
                SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) as success_count,
                SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failure_count,
                AVG(CASE WHEN success = TRUE THEN 1 ELSE 0 END) * 100 as success_rate
            FROM activity_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY type
            ORDER BY total_count DESC
        `;
        
        return await executeQuery(query, [days]);
    }

    // Get suspicious activities
    static async getSuspiciousActivities(limit = 50) {
        const query = `
            SELECT al.*,
                   u.first_name, u.last_name, u.email, u.employee_id
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE (
                -- Multiple failed login attempts
                (al.type = 'auth' AND al.success = FALSE) OR
                -- High-risk permission changes
                (al.type = 'permission' AND al.severity = 'critical') OR
                -- System configuration changes
                (al.type = 'system' AND al.action LIKE '%config%') OR
                -- Unusual access patterns (outside business hours)
                (HOUR(al.created_at) < 6 OR HOUR(al.created_at) > 22) OR
                -- Multiple different user agents from same user
                (al.user_id IN (
                    SELECT user_id 
                    FROM activity_logs 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
                    GROUP BY user_id 
                    HAVING COUNT(DISTINCT user_agent) > 3
                ))
            )
            AND al.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY al.created_at DESC
            LIMIT ?
        `;
        
        const activities = await executeQuery(query, [limit]);
        
        return activities.map(activity => ({
            ...activity,
            metadata: activity.metadata ? JSON.parse(activity.metadata) : null
        }));
    }

    // Export activities to CSV format
    static async exportToCSV(filters = {}) {
        const { logs } = await this.findAll(1, 10000, filters); // Get all matching records
        
        const csvHeader = [
            'Activity Code', 'Date', 'User', 'Type', 'Action', 'Description',
            'IP Address', 'Success', 'Severity'
        ].join(',');
        
        const csvRows = logs.map(log => [
            log.activity_code,
            new Date(log.created_at).toISOString(),
            `${log.first_name || ''} ${log.last_name || ''}`.trim() || 'System',
            log.type,
            log.action,
            `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes
            log.ip_address || '',
            log.success ? 'Yes' : 'No',
            log.severity
        ].join(','));
        
        return [csvHeader, ...csvRows].join('\n');
    }

    // Delete old logs by ID (for manual cleanup)
    static async deleteById(id) {
        const query = 'DELETE FROM activity_logs WHERE id = ?';
        await executeQuery(query, [id]);
    }

    // Bulk delete logs by criteria
    static async bulkDelete(filters = {}) {
        let query = 'DELETE FROM activity_logs WHERE 1=1';
        let params = [];

        if (filters.olderThanDays) {
            query += ' AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)';
            params.push(filters.olderThanDays);
        }
        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }
        if (filters.severity) {
            query += ' AND severity = ?';
            params.push(filters.severity);
        }
        if (filters.success !== undefined) {
            query += ' AND success = ?';
            params.push(filters.success);
        }

        const result = await executeQuery(query, params);
        return result.affectedRows;
    }
}

export default ActivityLog;