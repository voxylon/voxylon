const app = require('../src/server/app');

/**
 * Vercel optional catch-all function that forwards every `/api/*` request
 * to the shared Express application so existing routes keep working.
 */
module.exports = (req, res) => app(req, res);
