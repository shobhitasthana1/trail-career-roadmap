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

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/resources', resourceRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'TRAIL API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

module.exports = app;
