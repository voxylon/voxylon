# Common Utilities

Shared modules that are consumed by both the Express server and other Node-side scripts live here.

Current responsibilities:

- `supabase.js` – Supabase client initialization and database operations for the validator registry.
- `validation.js` – Helper utilities for validating Ethereum addresses, validator keys, and signatures.
- `db.js.old` – Legacy SQLite implementation (kept for reference during migration).

## Supabase Database Operations

The `supabase.js` module exports a `db` object with the following async methods:

### `getTotalCount()`
Returns the total number of registrations.

```javascript
const total = await db.getTotalCount();
```

### `findByAddress(address)`
Find a registration by Ethereum address (case-sensitive, checksummed).

```javascript
const registration = await db.findByAddress('0x1234...');
// Returns: { address, validator_key, signature } or null
```

### `findByValidatorKey(validatorKey)`
Find a registration by validator public key (case-insensitive).

```javascript
const registration = await db.findByValidatorKey('0xabcd...');
// Returns: { address, validator_key } or null
```

### `insertRegistration(address, validatorKey, signature)`
Insert a new registration. Throws error on duplicate.

```javascript
const stored = await db.insertRegistration(address, validatorKey, signature);
// Returns: { address, validator_key, signature }
```

All database operations return Promises and should be used with `async/await`.

## Environment Variables

Required:
- `SUPABASE_URL` – Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` – API key for authentication

When adding new utilities, keep the APIs framework-agnostic so they can be reused across agents or background workers.
