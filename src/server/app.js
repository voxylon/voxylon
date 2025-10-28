const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const registrationsRouter = require('./routes/registrations');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

const DIST_DIR = path.join(__dirname, '..', '..', 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://voxylon.net', 'https://www.voxylon.net']
    : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '1mb' }));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Voxylon server is running'
  });
});

app.use('/api/registrations', registrationsRouter);

app.get('*', (_req, res, next) => {
  if (fs.existsSync(INDEX_HTML)) {
    return res.sendFile(INDEX_HTML);
  }
  return next();
});

module.exports = app;
