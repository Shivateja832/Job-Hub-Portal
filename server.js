const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Security & Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
});

// Routes
app.get('/', (req, res) => res.json({ 
    message: 'Job Listing Portal API is running',
    version: '1.0.0',
    status: 'OK'
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/uploads', express.static('uploads'));

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: `Endpoint not found: ${req.method} ${req.path}`,
        availableEndpoints: {
            auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
            jobs: ['/api/jobs', '/api/jobs/:id', '/api/jobs/:id/apply'],
            dashboard: ['/api/dashboard/applications', '/api/dashboard/employer-applications']
        }
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Validation error',
            details: Object.values(err.errors).map(e => e.message)
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
    
    // Default error
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal server error. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { error: err })
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});




