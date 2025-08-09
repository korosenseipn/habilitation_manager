// api/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error(`Error ${req.requestId}:`, err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    // MySQL errors
    if (err.code) {
        switch (err.code) {
            case 'ER_DUP_ENTRY':
                error = { 
                    message: 'Duplicate entry - resource already exists', 
                    statusCode: 409 
                };
                break;
            case 'ER_NO_REFERENCED_ROW_2':
                error = { 
                    message: 'Referenced resource does not exist', 
                    statusCode: 400 
                };
                break;
            case 'ECONNREFUSED':
                error = { 
                    message: 'Database connection failed', 
                    statusCode: 503 
                };
                break;
            case 'ER_ACCESS_DENIED_ERROR':
                error = { 
                    message: 'Database access denied', 
                    statusCode: 503 
                };
                break;
        }
    }

    // File upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        error = { 
            message: 'File too large', 
            statusCode: 413 
        };
    }

    // Rate limit errors
    if (err.message && err.message.includes('Too many requests')) {
        error = { 
            message: 'Too many requests, please try again later', 
            statusCode: 429 
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            details: err 
        })
    });
};

export default errorHandler;