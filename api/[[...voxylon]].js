const app = require('../src/server/app');

/**
 * Vercel optional catch-all function that forwards every `/api/*` request
 * to the shared Express application so existing routes keep working.
 * Vercel strips the `/api` prefix before invoking this handler, so we
 * manually restore it to keep the Express router mounts unchanged.
 */
module.exports = (req, res) => {
  const originalUrl = req.url || '';

  if (!originalUrl.startsWith('/api')) {
    const needsLeadingSlash = originalUrl.startsWith('/') ? '' : '/';
    const restoredUrl = `/api${needsLeadingSlash}${originalUrl}`;
    req.url = restoredUrl;
    req.originalUrl = restoredUrl;
  }

  return app(req, res);
};
