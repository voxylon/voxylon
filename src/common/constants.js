const REGISTRATION_DEADLINE_ISO = '2025-12-31T23:59:59Z';
const REGISTRATION_DEADLINE = new Date(REGISTRATION_DEADLINE_ISO);

const VALIDATOR_KEY_PATTERN = /^0x[a-fA-F0-9]{96}$/;
const SIGNATURE_PATTERN = /^0x[a-fA-F0-9]{130}$/;

const buildRegistrationMessage = (validatorKey) => `Register Validator: ${validatorKey}`;

module.exports = {
  REGISTRATION_DEADLINE_ISO,
  REGISTRATION_DEADLINE,
  VALIDATOR_KEY_PATTERN,
  SIGNATURE_PATTERN,
  buildRegistrationMessage
};
