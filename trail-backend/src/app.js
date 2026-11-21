const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const jobRoutes = require('./routes/jobRoutes');
const skillRoutes = require('./routes/skillRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');
const progressRoutes = require('./routes/progressRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS configuration for local and deployed frontends
const allowedOrigins = [
  'https://trail-career-roadmap.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:5051',
  'http://localhost:8080',
];

if (process.env.CLIENT_ORIGIN) {
  process.env.CLIENT_ORIGIN.split(',').forEach((o) => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Basic rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API route registrations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/resources', resourceRoutes);

// Server health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'TRAIL API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? err.message || 'Internal server error' : err.message,
  });
});

module.exports = app;
