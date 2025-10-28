## Overview

**Voxylon (VXN)** is a community-owned, Ethereum-compatible Proof-of-Stake blockchain, launching with **zero premine**, **no insiders**, and **no unfair advantages**. Voxylon aims to be the **fairest Layer 1 launch in crypto history**, leveraging Ethereum's existing user base to bootstrap an entirely decentralized validator set at genesis.

### Who Can Join?

Anyone who held an Ethereum account that paid at least **0.004 ETH in transaction fees** (gas) by **December 31, 2025** is eligible.

> Based on current projections, **60 million+ accounts** will qualify by the cutoff date.

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Supabase account for database
- EIP-6963 compatible wallet (for registration)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Required: Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Server Configuration
PORT=3000
NODE_ENV=development

# For Vercel deployments
VERCEL=1
```

### Installation

```bash
# Install dependencies
npm install

# Set up database (run schema.sql in your Supabase SQL editor)
# See schema.sql for database setup

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
voxylon/
├── api/                    # Vercel serverless functions
│   ├── index.js           # API catch-all handler
│   └── og.jsx             # OpenGraph image generation
├── src/
│   ├── common/            # Shared utilities
│   │   ├── constants.js   # Shared constants
│   │   ├── supabase.js    # Database client
│   │   └── validation.js  # Validation utilities
│   ├── components/        # React components
│   ├── pages/            # React pages
│   │   └── Register.jsx  # Registration page
│   └── server/           # Express backend
│       ├── app.js        # Express app
│       ├── index.js      # Server entry point
│       ├── middleware/   # Express middleware
│       └── routes/       # API routes
├── tests/                # Test files
├── schema.sql            # Database schema
└── package.json          # Dependencies

```

## API Endpoints

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Voxylon server is running"
}
```

### GET `/api/registrations`
Get total registration count.

**Response:**
```json
{
  "total": 12345
}
```

### GET `/api/registrations/:address`
Get registration by Ethereum address.

**Response:**
```json
{
  "address": "0x...",
  "validatorKey": "0x...",
  "signature": "0x...",
  "isValid": true
}
```

### GET `/api/registrations/validator-keys/:validatorKey`
Check if a validator key is already registered.

**Response (if registered):**
```json
{
  "registered": true,
  "message": "Validator key is already registered."
}
```

### POST `/api/registrations`
Create a new registration.

**Request Body:**
```json
{
  "address": "0x...",
  "validatorKey": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "address": "0x...",
  "validatorKey": "0x...",
  "signature": "0x...",
  "message": "Registration created.",
  "isValid": true,
  "signedMessage": "Register Validator: 0x..."
}
```

## Security Features

- **Rate Limiting**: Protects against DoS attacks
  - General API: 100 requests per 15 minutes
  - Registration: 5 attempts per hour
  - Lookups: 50 requests per 5 minutes
- **Signature Verification**: All registrations verified using ethers.js
- **Input Validation**: Address, validator key, and signature format validation
- **Row-Level Security**: Enabled on Supabase database

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

The project automatically handles Vercel serverless functions.

### Database Setup

Run the SQL commands in `schema.sql` in your Supabase SQL Editor to:
- Create the `registrations` table
- Set up indexes for performance
- Enable Row-Level Security (RLS)
- Configure access policies

## Development

### Running Tests

```bash
npm test
```

Tests include:
- API endpoint validation
- Registration flow
- Duplicate prevention
- Signature verification

### Development Server

```bash
# Run both client and server in watch mode
npm run dev

# Run server only
npm run dev:server

# Run client only
npm run dev:client
```

## License
MIT © Voxylon contributors

