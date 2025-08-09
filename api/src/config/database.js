// api/src/config/database.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'habilitation_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    timezone: '+00:00',
    charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        
        // Test query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Database test query successful');
        
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Execute query helper function
export const executeQuery = async (query, params = []) => {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Get single record helper
export const getOne = async (query, params = []) => {
    try {
        const [results] = await pool.execute(query, params);
        return results[0] || null;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Execute transaction
export const executeTransaction = async (queries) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
        const results = [];
        for (const { query, params } of queries) {
            const [result] = await connection.execute(query, params);
            results.push(result);
        }
        
        await connection.commit();
        connection.release();
        return results;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};

// Get database statistics
export const getDatabaseStats = async () => {
    try {
        const [tables] = await pool.execute(`
            SELECT 
                table_name as tableName,
                table_rows as rowCount,
                ROUND(((data_length + index_length) / 1024 / 1024), 2) as sizeInMB
            FROM information_schema.tables 
            WHERE table_schema = ?
            ORDER BY (data_length + index_length) DESC
        `, [process.env.DB_NAME]);
        
        return tables;
    } catch (error) {
        console.error('Database stats error:', error);
        return [];
    }
};

// Close all connections
export const closeDatabase = async () => {
    try {
        await pool.end();
        console.log('✅ Database connections closed');
    } catch (error) {
        console.error('❌ Error closing database connections:', error);
    }
};

export default pool;