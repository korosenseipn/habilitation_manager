// api/src/middleware/notFound.js
const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        availableRoutes: {
            health: '/health',
            api: process.env.API_PREFIX || '/api/v1'
        }
    });
};

export default notFound;