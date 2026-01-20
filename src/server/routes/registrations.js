const express = require('express');
const {
  REGISTRATION_DEADLINE_ISO,
  buildRegistrationMessage,
  isDeadlinePassed,
  isValidSignatureFormat,
  isValidValidatorKey,
  normalizeAddress,
  normalizeValidatorKey,
  verifySignature
} = require('../../common/validation');
const { lookupLimiter, registrationLimiter } = require('../middleware/rateLimiter');
const { STATIC_REGISTRATION_COUNT, STATIC_REGISTRATIONS, STATIC_VALIDATOR_KEYS } = require('../../common/staticData');

const USE_STATIC_DATA = process.env.USE_STATIC_DATA === 'true';

let db;
if (!USE_STATIC_DATA) {
  db = require('../../common/supabase').db;
}

const router = express.Router();

router.get('/', lookupLimiter, async (_req, res) => {
  if (USE_STATIC_DATA) {
    return res.json({ total: STATIC_REGISTRATION_COUNT });
  }
  try {
    const total = await db.getTotalCount();
    return res.json({ total });
  } catch (error) {
    console.error('Failed to get registration count', error);
    return res.status(500).json({ message: 'Failed to retrieve registration count.' });
  }
});

router.get('/validator-keys/:validatorKey', lookupLimiter, async (req, res) => {
  const { validatorKey } = req.params;

  if (!isValidValidatorKey(validatorKey)) {
    return res.status(400).json({
      message: 'Validator public key must be 0x-prefixed and 96 hexadecimal characters long.'
    });
  }

  const normalizedValidatorKey = normalizeValidatorKey(validatorKey);

  if (USE_STATIC_DATA) {
    if (STATIC_VALIDATOR_KEYS.has(normalizedValidatorKey)) {
      return res.json({
        registered: true,
        message: 'Validator key is already registered.'
      });
    }
    return res.status(404).json({ message: 'Validator key not registered.' });
  }

  try {
    const record = await db.findByValidatorKey(normalizedValidatorKey);

    if (!record) {
      return res.status(404).json({ message: 'Validator key not registered.' });
    }

    return res.json({
      registered: true,
      message: 'Validator key is already registered.'
    });
  } catch (error) {
    console.error('Failed to lookup validator key', error);
    return res.status(500).json({ message: 'Failed to lookup validator key.' });
  }
});

router.get('/:address', lookupLimiter, async (req, res) => {
  if (USE_STATIC_DATA) {
    const address = normalizeAddress(req.params.address);
    const record = STATIC_REGISTRATIONS.find(
      reg => normalizeAddress(reg.address) === address
    );

    if (!record) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    const isValid = verifySignature(record.address, record.validator_key, record.signature);

    return res.json({
      address: record.address,
      validatorKey: record.validator_key,
      signature: record.signature,
      isValid
    });
  }

  try {
    const address = normalizeAddress(req.params.address);
    const record = await db.findByAddress(address);

    if (!record) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    const isValid = verifySignature(record.address, record.validator_key, record.signature);

    return res.json({
      address: record.address,
      validatorKey: record.validator_key,
      signature: record.signature,
      isValid
    });
  } catch (error) {
    console.error('Failed to get registration', error);
    return res.status(400).json({ message: 'Invalid Ethereum address.' });
  }
});

router.post('/', registrationLimiter, async (req, res) => {
  return res.status(403).json({
    message: 'Registration is closed. The registration period has ended.'
  });
});

module.exports = router;
