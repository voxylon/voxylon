# Server Tests

These Jest + Supertest checks exercise the HTTP interface exposed by `src/server/app.js`. They confirm that the health endpoint returns a baseline payload, the HTML shell renders, and static assets are reachable.

Add new suites here whenever you introduce API routes or middleware that require direct verification.
