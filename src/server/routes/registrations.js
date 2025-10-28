const express = require('express');
const { db } = require('../../common/supabase');
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

const router = express.Router();

router.get('/', lookupLimiter, async (_req, res) => {
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
  if (isDeadlinePassed()) {
    return res.status(400).json({
      message: `Registration closed on ${REGISTRATION_DEADLINE_ISO}.`
    });
  }

  const { address, validatorKey, signature } = req.body || {};

  if (!address || !validatorKey || !signature) {
    return res.status(400).json({ message: 'address, validatorKey, and signature are required.' });
  }

  try {
    const normalizedAddress = normalizeAddress(address);
    const normalizedValidatorKey = normalizeValidatorKey(validatorKey);

    if (!isValidValidatorKey(normalizedValidatorKey)) {
      return res.status(400).json({
        message: 'Validator public key must be 0x-prefixed and 96 hexadecimal characters long.'
      });
    }

    if (!isValidSignatureFormat(signature)) {
      return res.status(400).json({
        message: 'Signature must be a 0x-prefixed 65 byte personal_sign signature.'
      });
    }

    const isSignatureValid = verifySignature(normalizedAddress, normalizedValidatorKey, signature);
    if (!isSignatureValid) {
      return res.status(400).json({
        message: 'Signature is invalid for the supplied account and validator key.'
      });
    }

    const existingRecord = await db.findByAddress(normalizedAddress);
    if (existingRecord) {
      return res.status(409).json({
        message: 'Registration already exists for this Ethereum account.'
      });
    }

    const existingForKey = await db.findByValidatorKey(normalizedValidatorKey);
    if (existingForKey) {
      return res.status(409).json({
        message: 'Validator public key has already been registered by another account.'
      });
    }

    const stored = await db.insertRegistration(normalizedAddress, normalizedValidatorKey, signature);

    return res.status(201).json({
      address: stored.address,
      validatorKey: stored.validator_key,
      signature: stored.signature,
      message: 'Registration created.',
      isValid: true,
      signedMessage: buildRegistrationMessage(stored.validator_key)
    });
  } catch (error) {
    if (error.code === 'UNIQUE_VIOLATION') {
      return res.status(409).json({
        message: 'Duplicate registration detected.'
      });
    }
    console.error('Failed to store registration', error);
    return res.status(500).json({
      message: 'Unexpected error storing registration.'
    });
  }
});

module.exports = router;
