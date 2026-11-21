const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);

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