// api/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import routes (we'll create these)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import habilitationRoutes from './routes/habilitations.js';
import permissionRoutes from './routes/permissions.js';
import documentRoutes from './routes/documents.js';
import activityRoutes from './routes/activity.js';
import reportRoutes from './routes/reports.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:4028',
            'http://localhost:3000'
        ];
        
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-Access-Token'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW || 15) * 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health' || req.path === '/api/v1/health';
    }
});

app.use(limiter);

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.LOG_FORMAT || 'combined'));
}

// Body parsing middleware
app.use(express.json({ 
    limit: process.env.MAX_FILE_SIZE || '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.use(express.urlencoded({ 
    extended: true, 
    limit: process.env.MAX_FILE_SIZE || '10mb' 
}));

// Static file serving for uploads
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Request timeout middleware
app.use((req, res, next) => {
    res.setTimeout(parseInt(process.env.REQUEST_TIMEOUT) || 30000, () => {
        res.status(408).json({
            success: false,
            message: 'Request timeout'
        });
    });
    next();
});

// Add request ID for tracking
app.use((req, res, next) => {
    req.requestId = Math.random().toString(36).substring(2, 15);
    res.set('X-Request-ID', req.requestId);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Habilitation Manager API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        requestId: req.requestId
    });
});

// API routes with version prefix
const apiPrefix = process.env.API_PREFIX || '/api/v1';

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/habilitations`, habilitationRoutes);
app.use(`${apiPrefix}/permissions`, permissionRoutes);
app.use(`${apiPrefix}/documents`, documentRoutes);
app.use(`${apiPrefix}/activity`, activityRoutes);
app.use(`${apiPrefix}/reports`, reportRoutes);

// API info endpoint
app.get(apiPrefix, (req, res) => {
    res.json({
        success: true,
        message: 'Habilitation Manager API',
        version: '1.0.0',
        endpoints: {
            auth: `${apiPrefix}/auth`,
            users: `${apiPrefix}/users`,
            habilitations: `${apiPrefix}/habilitations`,
            permissions: `${apiPrefix}/permissions`,
            documents: `${apiPrefix}/documents`,
            activity: `${apiPrefix}/activity`,
            reports: `${apiPrefix}/reports`
        },
        documentation: 'https://api-docs.example.com'
    });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;