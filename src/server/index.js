require('dotenv').config();

const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;

// For Vercel serverless functions, just export the app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development, start the HTTP server
  const server = http.createServer(app);
  
  server.listen(PORT, () => {
    console.log(`Voxylon server listening on http://localhost:${PORT}`);
  });
}
