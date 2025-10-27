# Routes

Express routers live here. `registrations.js` exposes the CRUD interface used by the validator registration client.

- `POST /api/registrations` – validates the payload, verifies the signature, and upserts the registration.
- `GET /api/registrations/:address` – retrieves the saved registration and re-verifies the signature before returning the payload.

Attach new routers in `app.js` so they share middleware and error handling with the rest of the application.
