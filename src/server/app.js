const path = require('path');
const fs = require('fs');
const express = require('express');
const registrationsRouter = require('./routes/registrations');

const app = express();

const DIST_DIR = path.join(__dirname, '..', '..', 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

app.use(express.json({ limit: '1mb' }));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

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
