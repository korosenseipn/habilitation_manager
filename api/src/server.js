// api/src/server.js
import app from './app.js';
import { testConnection, closeDatabase } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Start server function
const startServer = async () => {
    try {
        // Test database connection first
        console.log('🔄 Testing database connection...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Server not starting.');
            process.exit(1);
        }

        // Start the Express server
        const server = app.listen(PORT, HOST, () => {
            console.log('\n🚀 Habilitation Manager API Server Started');
            console.log(`📍 Server running on: http://${HOST}:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:4028'}`);
            console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
            console.log(`📚 API documentation: http://${HOST}:${PORT}${process.env.API_PREFIX || '/api/v1'}`);
            console.log('✅ Server ready to accept connections\n');
        });

        // Server error handling
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error('❌ Server error:', error);
            }
            process.exit(1);
        });

        // Graceful shutdown handlers
        const gracefulShutdown = async (signal) => {
            console.log(`\n📥 Received ${signal}. Starting graceful shutdown...`);
            
            // Stop accepting new connections
            server.close(async () => {
                console.log('🔒 HTTP server closed');
                
                // Close database connections
                await closeDatabase();
                
                console.log('✅ Graceful shutdown completed');
                process.exit(0);
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        // Handle different termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        return server;

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle warning events
process.on('warning', (warning) => {
    console.warn('⚠️ Warning:', warning.message);
});

// Start the server
startServer().catch((error) => {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
});